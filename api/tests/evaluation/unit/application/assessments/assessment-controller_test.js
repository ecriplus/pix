import { usecases as devcompUsecases } from '../../../../../src/devcomp/domain/usecases/index.js';
import { assessmentController } from '../../../../../src/evaluation/application/assessments/assessment-controller.js';
import { evaluationUsecases } from '../../../../../src/evaluation/domain/usecases/index.js';
import { usecases as questUsecases } from '../../../../../src/quest/domain/usecases/index.js';
import { config } from '../../../../../src/shared/config.js';
import { DomainTransaction } from '../../../../../src/shared/domain/DomainTransaction.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | Controller | assessment-controller', function () {
  describe('#completeAssessment', function () {
    let assessmentId, assessment, locale;

    beforeEach(function () {
      assessmentId = 2;
      assessment = Symbol('completed-assessment');
      locale = 'fr-fr';
      sinon.stub(DomainTransaction, 'execute').callsFake((lambda) => {
        return lambda();
      });

      sinon.stub(evaluationUsecases, 'completeAssessment');
      sinon.stub(evaluationUsecases, 'handleBadgeAcquisition');
      sinon.stub(devcompUsecases, 'handleTrainingRecommendation');
      sinon.stub(evaluationUsecases, 'handleStageAcquisition');
      sinon.stub(questUsecases, 'rewardUser');
      evaluationUsecases.completeAssessment.resolves(assessment);
      evaluationUsecases.handleBadgeAcquisition.resolves();
    });

    it('should call the completeAssessment use case', async function () {
      // when
      await assessmentController.completeAssessment({ params: { id: assessmentId } });

      // then
      expect(evaluationUsecases.completeAssessment).to.have.been.calledWithExactly({ assessmentId, locale });
    });

    it('should call the handleBadgeAcquisition use case', async function () {
      // when
      await assessmentController.completeAssessment({ params: { id: assessmentId } });

      // then
      expect(evaluationUsecases.handleBadgeAcquisition).to.have.been.calledWithExactly({ assessment });
    });

    it('should call the handleTrainingRecommendation use case', async function () {
      // given
      const locale = 'fr-fr';

      // when
      await assessmentController.completeAssessment({ params: { id: assessmentId } });

      // then
      expect(devcompUsecases.handleTrainingRecommendation).to.have.been.calledWithExactly({
        assessment,
        locale,
      });
    });

    it('should not call the rewardUser usecase if the questEnabled flag is false', async function () {
      // given
      config.featureToggles.isQuestEnabled = false;
      evaluationUsecases.completeAssessment.resolves({ userId: 12 });

      // when
      await assessmentController.completeAssessment({ params: { id: assessmentId } });

      // then
      expect(questUsecases.rewardUser).to.have.not.been.called;
    });

    it('should call the rewardUser use case if there is a userId', async function () {
      // given
      config.featureToggles.isQuestEnabled = true;
      evaluationUsecases.completeAssessment.resolves({ userId: 12 });

      // when
      await assessmentController.completeAssessment({ params: { id: assessmentId } });

      // then
      expect(questUsecases.rewardUser).to.have.been.calledWithExactly({
        userId: 12,
      });
    });

    it('should not call the rewardUser use case if there is no userId', async function () {
      // given
      evaluationUsecases.completeAssessment.resolves({ userId: null });

      // when
      await assessmentController.completeAssessment({ params: { id: assessmentId } });

      // then
      expect(questUsecases.rewardUser).to.be.not.called;
    });
  });
});
