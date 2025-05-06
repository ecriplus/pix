import { rescoreCertification } from '../../../../../../src/certification/evaluation/domain/usecases/rescore-certification.js';
import { SessionAlreadyPublishedError } from '../../../../../../src/certification/session-management/domain/errors.js';
import CertificationRescored from '../../../../../../src/certification/session-management/domain/events/CertificationRescored.js';
import {
  CertificationAlgorithmVersionError,
  NotFinalizedSessionError,
} from '../../../../../../src/shared/domain/errors.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Results | Unit | Domain | Use Cases | rescore-certification', function () {
  describe('when the algorithm used in certification is V3', function () {
    describe('when the session is finalized', function () {
      it('should rescore the given certification', async function () {
        // given
        const locale = 'fr-fr';
        const certificationCourseId = 123;
        const certificationAssessmentRepository = {
          getByCertificationCourseId: sinon.stub(),
        };
        const evaluationSessionRepository = {
          getByCertificationCourseId: sinon.stub(),
        };
        const services = {
          handleV3CertificationScoring: sinon.stub(),
          findByCertificationCourseIdAndAssessmentId: sinon.stub(),
        };
        const certificationAssessment = domainBuilder.buildCertificationAssessment({
          certificationCourseId,
          version: 3,
        });
        const session = domainBuilder.certification.evaluation.buildResultsSession({ isFinalized: true });
        evaluationSessionRepository.getByCertificationCourseId.withArgs({ certificationCourseId }).resolves(session);
        certificationAssessmentRepository.getByCertificationCourseId
          .withArgs({ certificationCourseId })
          .resolves(certificationAssessment);

        // when
        await rescoreCertification({
          locale,
          certificationCourseId,
          certificationAssessmentRepository,
          evaluationSessionRepository,
          services,
        });

        // then
        expect(services.handleV3CertificationScoring).to.have.been.calledWithExactly({
          event: new CertificationRescored({
            certificationCourseId: certificationAssessment.certificationCourseId,
          }),
          certificationAssessment,
          locale,
          dependencies: {
            findByCertificationCourseIdAndAssessmentId: services.findByCertificationCourseIdAndAssessmentId,
          },
        });
      });
    });

    describe('when the session is published', function () {
      it('should throw an error', async function () {
        // given
        const locale = 'fr-fr';
        const certificationCourseId = 123;
        const certificationAssessmentRepository = {
          getByCertificationCourseId: sinon.stub(),
        };
        const evaluationSessionRepository = {
          getByCertificationCourseId: sinon.stub(),
        };
        const services = {
          handleV3CertificationScoring: sinon.stub(),
          findByCertificationCourseIdAndAssessmentId: sinon.stub(),
        };
        const certificationAssessment = domainBuilder.buildCertificationAssessment({
          certificationCourseId,
          version: 3,
        });
        certificationAssessmentRepository.getByCertificationCourseId
          .withArgs({ certificationCourseId })
          .resolves(certificationAssessment);
        const session = domainBuilder.certification.evaluation.buildResultsSession({
          isFinalized: true,
          isPublished: true,
        });
        evaluationSessionRepository.getByCertificationCourseId.withArgs({ certificationCourseId }).resolves(session);

        // when
        const error = await catchErr(rescoreCertification)({
          locale,
          certificationCourseId,
          certificationAssessmentRepository,
          evaluationSessionRepository,
          services,
        });

        // then
        expect(error).to.be.instanceOf(SessionAlreadyPublishedError);
      });
    });

    describe('when the session is not finalized', function () {
      it('should throw an error', async function () {
        // given
        const locale = 'fr-fr';
        const certificationCourseId = 123;
        const certificationAssessmentRepository = {
          getByCertificationCourseId: sinon.stub(),
        };
        const evaluationSessionRepository = {
          getByCertificationCourseId: sinon.stub(),
        };
        const services = {
          handleV3CertificationScoring: sinon.stub(),
          findByCertificationCourseIdAndAssessmentId: sinon.stub(),
        };
        const certificationAssessment = domainBuilder.buildCertificationAssessment({
          certificationCourseId,
          version: 3,
        });
        certificationAssessmentRepository.getByCertificationCourseId
          .withArgs({ certificationCourseId })
          .resolves(certificationAssessment);
        const session = domainBuilder.certification.evaluation.buildResultsSession({ isFinalized: false });
        evaluationSessionRepository.getByCertificationCourseId.withArgs({ certificationCourseId }).resolves(session);

        // when
        const error = await catchErr(rescoreCertification)({
          locale,
          certificationCourseId,
          certificationAssessmentRepository,
          evaluationSessionRepository,
          services,
        });

        // then
        expect(error).to.be.instanceOf(NotFinalizedSessionError);
      });
    });
  });

  describe('when the algorithm used in certification is V2', function () {
    it('should throw an error', async function () {
      // given
      const locale = 'fr-fr';
      const certificationCourseId = 123;
      const certificationAssessmentRepository = {
        getByCertificationCourseId: sinon.stub(),
      };
      const certificationAssessment = domainBuilder.buildCertificationAssessment({
        certificationCourseId,
        version: 2,
      });
      certificationAssessmentRepository.getByCertificationCourseId
        .withArgs({ certificationCourseId })
        .resolves(certificationAssessment);

      // when
      const error = await catchErr(rescoreCertification)({
        locale,
        certificationCourseId,
        certificationAssessmentRepository,
      });

      // then
      expect(error).to.be.an.instanceof(CertificationAlgorithmVersionError);
    });
  });
});
