const { expect, sinon, catchErr } = require('../../../test-helper');
const { UserNotAuthorizedToAccessEntity, BadRequestError } = require('../../../../lib/domain/errors');
const importCertificationCandidatesFromAttendanceSheet = require('../../../../lib/domain/usecases/import-certification-candidates-from-attendance-sheet');
const certificationCandidateRepository = require('../../../../lib/infrastructure/repositories/certification-candidate-repository');
const sessionRepository = require('../../../../lib/infrastructure/repositories/session-repository');
const certificationCandidatesOdsService = require('../../../../lib/domain/services/certification-candidates-ods-service');

describe('Unit | UseCase | import-certification-candidates-from-attendance-sheet', () => {

  describe('#importCertificationCandidatesFromAttendanceSheet', () => {
    const userId = 'userId';
    const sessionId = 'sessionId';
    const odsBuffer = 'buffer';
    const certificationCandidates = 'extractedCandidates';

    context('when user does not have access to session', () => {

      beforeEach(() => {
        sinon.stub(sessionRepository, 'ensureUserHasAccessToSession')
          .withArgs(userId, sessionId)
          .rejects(new UserNotAuthorizedToAccessEntity(sessionId));
      });

      it('should throw a UserNotAuthorizedToAccessEntity error', async () => {
        // when
        const result = await catchErr(importCertificationCandidatesFromAttendanceSheet)({
          userId,
          sessionId,
          odsBuffer,
          certificationCandidatesOdsService,
          sessionRepository,
          certificationCandidateRepository,
        });

        // then
        expect(result).to.be.an.instanceOf(UserNotAuthorizedToAccessEntity);
      });

    });

    context('when user has access to session', () => {

      beforeEach(() => {
        sinon.stub(sessionRepository, 'ensureUserHasAccessToSession')
          .withArgs(userId, sessionId)
          .resolves();
      });

      context('when session contains already linked certification candidates', () => {

        beforeEach(() => {
          sinon.stub(certificationCandidateRepository, 'doesLinkedCertificationCandidateInSessionExist')
            .withArgs({ sessionId })
            .resolves(true);
        });

        it('should throw a BadRequestError', async () => {
          // when
          const result = await catchErr(importCertificationCandidatesFromAttendanceSheet)({
            userId,
            sessionId,
            odsBuffer,
            certificationCandidatesOdsService,
            sessionRepository,
            certificationCandidateRepository,
          });

          // then
          expect(result).to.be.an.instanceOf(BadRequestError);
        });

      });

      context('when session contains zero linked certification candidates', () => {

        beforeEach(() => {
          sinon.stub(certificationCandidateRepository, 'doesLinkedCertificationCandidateInSessionExist')
            .withArgs({ sessionId })
            .resolves(false);
          sinon.stub(certificationCandidatesOdsService, 'extractCertificationCandidatesFromAttendanceSheet')
            .withArgs({ sessionId, odsBuffer })
            .resolves(certificationCandidates);
          sinon.stub(certificationCandidateRepository, 'setSessionCandidates')
            .withArgs(sessionId, certificationCandidates)
            .resolves();
        });

        it('should call the appropriate methods', async function() {
          // when
          await importCertificationCandidatesFromAttendanceSheet({
            userId,
            sessionId,
            odsBuffer,
            certificationCandidatesOdsService,
            sessionRepository,
            certificationCandidateRepository,
          });

          // then
          expect(sessionRepository.ensureUserHasAccessToSession).to.have.been.calledWith(userId, sessionId);
          expect(certificationCandidateRepository.doesLinkedCertificationCandidateInSessionExist).to.have.been.calledWith({ sessionId });
          expect(certificationCandidatesOdsService.extractCertificationCandidatesFromAttendanceSheet).to.have.been.calledWith({ sessionId, odsBuffer });
          expect(certificationCandidatesOdsService.extractCertificationCandidatesFromAttendanceSheet.calledAfter(sessionRepository.ensureUserHasAccessToSession))
            .to.be.true;
          expect(certificationCandidateRepository.setSessionCandidates).to.have.been.calledWith(sessionId, certificationCandidates);
          expect(certificationCandidateRepository.setSessionCandidates.calledAfter(certificationCandidatesOdsService.extractCertificationCandidatesFromAttendanceSheet))
            .to.be.true;
        });
      });

    });

  });

});
