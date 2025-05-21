import { simulateFlashAssessmentScenario } from '../../../../../../src/certification/flash-certification/domain/usecases/simulate-flash-assessment-scenario.js';
import { LOCALE } from '../../../../../../src/shared/domain/constants.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('#simulateFlashAssessmentScenario', function () {
  describe('when a complementary certification scenario is required', function () {
    it('should fetch the complementary framework challenges', async function () {
      // given
      const locale = LOCALE.FRENCH_FRANCE;
      const accessibilityAdjustmentNeeded = false;
      const complementaryCertification = domainBuilder.buildComplementaryCertification();
      const challengeRepositoryStub = { findActiveFlashCompatible: sinon.stub() };
      const complementaryCertificationRepositoryStub = {
        getByKey: sinon.stub().resolves(complementaryCertification),
      };

      // when
      await catchErr(simulateFlashAssessmentScenario)({
        locale,
        accessibilityAdjustmentNeeded,
        complementaryCertificationKey: complementaryCertification.key,
        challengeRepository: challengeRepositoryStub,
        complementaryCertificationRepository: complementaryCertificationRepositoryStub,
      });

      // then
      expect(complementaryCertificationRepositoryStub.getByKey).to.have.been.calledOnceWithExactly(
        complementaryCertification.key,
      );

      expect(challengeRepositoryStub.findActiveFlashCompatible).to.have.been.calledOnceWithExactly({
        locale,
        accessibilityAdjustmentNeeded,
        complementaryCertificationId: complementaryCertification.id,
      });
    });
  });

  describe('when a complementary certification scenario is not required', function () {
    it('should fetch the core referential challenges', async function () {
      // given
      const locale = LOCALE.FRENCH_FRANCE;
      const accessibilityAdjustmentNeeded = false;
      const challengeRepositoryStub = { findActiveFlashCompatible: sinon.stub() };
      const complementaryCertificationRepositoryStub = {
        getByKey: sinon.stub(),
      };

      // when
      await catchErr(simulateFlashAssessmentScenario)({
        locale,
        accessibilityAdjustmentNeeded,
        complementaryCertificationKey: undefined,
        challengeRepository: challengeRepositoryStub,
      });

      // then
      expect(complementaryCertificationRepositoryStub.getByKey).not.to.have.been.called;

      expect(challengeRepositoryStub.findActiveFlashCompatible).to.have.been.calledOnceWithExactly({
        locale,
        accessibilityAdjustmentNeeded,
        complementaryCertificationId: undefined,
      });
    });
  });
});
