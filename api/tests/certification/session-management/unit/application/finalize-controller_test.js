import { finalizeController } from '../../../../../src/certification/session-management/application/finalize-controller.js';
import { usecases } from '../../../../../src/certification/session-management/domain/usecases/index.js';
import { DomainTransaction } from '../../../../../src/shared/domain/DomainTransaction.js';
import { expect, hFake, sinon } from '../../../../test-helper.js';

describe('Certification | Session Management | Unit | Application | Controller | Finalize', function () {
  describe('#finalize', function () {
    it('should call the finalizeSession usecase with correct values', async function () {
      // given
      const sessionId = 1;
      const aCertificationReport = Symbol('a certficication report');
      const sessionFinalized = Symbol('sessionFinalized');
      const autoJuryDone = Symbol('autoJuryDone');
      const examinerGlobalComment = 'It was a fine session my dear';
      const hasIncident = true;
      const hasJoiningIssue = true;
      const certificationReports = [
        {
          type: 'certification-reports',
        },
      ];
      const request = {
        params: {
          sessionId,
        },
        payload: {
          data: {
            attributes: {
              'examiner-global-comment': examinerGlobalComment,
              'has-incident': hasIncident,
              'has-joining-issue': hasJoiningIssue,
            },
            included: certificationReports,
          },
        },
      };
      const certificationReportSerializer = { deserialize: sinon.stub() };
      certificationReportSerializer.deserialize.resolves(aCertificationReport);
      sinon.stub(usecases, 'finalizeSession').resolves(sessionFinalized);
      sinon.stub(usecases, 'processAutoJury').resolves(autoJuryDone);
      sinon.stub(usecases, 'registerPublishableSession').resolves();
      sinon.stub(DomainTransaction, 'execute').callsFake((callback) => {
        return callback();
      });

      // when
      await finalizeController.finalize(request, hFake, { certificationReportSerializer });

      // then
      expect(usecases.finalizeSession).to.have.been.calledWithExactly({
        sessionId,
        examinerGlobalComment,
        hasIncident,
        hasJoiningIssue,
        certificationReports: [aCertificationReport],
      });
      expect(usecases.processAutoJury).to.have.been.calledWithExactly({
        sessionFinalized,
      });
      expect(usecases.registerPublishableSession).to.have.been.calledWithExactly({ autoJuryDone });
    });
  });
});
