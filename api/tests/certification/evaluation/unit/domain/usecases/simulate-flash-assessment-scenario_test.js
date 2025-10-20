import * as simulateFlashAssessmentScenarioModule from '../../../../../../src/certification/evaluation/domain/usecases/simulate-flash-assessment-scenario.js';
import { Frameworks } from '../../../../../../src/certification/shared/domain/models/Frameworks.js';
import { FRENCH_FRANCE } from '../../../../../../src/shared/domain/services/locale-service.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../../test-helper.js';

const { simulateFlashAssessmentScenario } = simulateFlashAssessmentScenarioModule;

describe('Unit | Domain | Usecases | simulate-flash-assessment-scenario', function () {
  describe('#simulateFlashAssessmentScenario', function () {
    describe('when simulating a complementary certification', function () {
      it('should get the challenges using the right parameters', async function () {
        // given
        const locale = FRENCH_FRANCE;
        const versionId = 1;
        const challengesConfiguration = { minimumEstimatedSuccessRateRanges: [] };
        const version = domainBuilder.certification.configuration.buildVersion({
          id: versionId,
          scope: Frameworks.PIX_PLUS_DROIT,
          challengesConfiguration,
        });

        const challengeRepositoryStub = {
          findActiveFlashCompatible: sinon.stub().resolves([]),
        };
        const versionRepositoryStub = {
          getById: sinon.stub().resolves(version),
        };

        // when
        await catchErr(simulateFlashAssessmentScenario)({
          locale,
          sharedChallengeRepository: challengeRepositoryStub,
          versionRepository: versionRepositoryStub,
          versionId,
        });

        // then
        expect(challengeRepositoryStub.findActiveFlashCompatible).to.have.been.calledOnceWithExactly({
          locale,
          accessibilityAdjustmentNeeded: undefined,
          version,
        });
      });

      it('should get the version using correct parameters', async function () {
        // given
        const locale = FRENCH_FRANCE;
        const versionId = 123;
        const challengesConfiguration = { minimumEstimatedSuccessRateRanges: [] };

        const challengeRepositoryStub = {
          findActiveFlashCompatible: sinon.stub().resolves([]),
        };
        const versionRepositoryStub = {
          getById: sinon.stub().resolves({ id: versionId, scope: Frameworks.PIX_PLUS_DROIT, challengesConfiguration }),
        };

        // when
        await catchErr(simulateFlashAssessmentScenario)({
          locale,
          sharedChallengeRepository: challengeRepositoryStub,
          versionRepository: versionRepositoryStub,
          versionId,
        });

        // then
        expect(versionRepositoryStub.getById).to.have.been.calledOnceWithExactly(versionId);
      });

      it('should pass the challenges configuration to the simulator', async function () {
        // given
        const locale = FRENCH_FRANCE;
        const versionId = 456;
        const challengesConfiguration = {
          minimumEstimatedSuccessRateRanges: [
            { type: 'fixed', startingChallengeIndex: 0, endingChallengeIndex: 2, minimumEstimatedSuccessRate: 0.8 },
          ],
          challengesBetweenSameCompetence: 3,
          limitToOneQuestionPerTube: false,
          enablePassageByAllCompetences: true,
          warmUpLength: 2,
          maximumAssessmentLength: 10,
        };

        const challengeRepositoryStub = {
          findActiveFlashCompatible: sinon.stub().resolves([]),
        };
        const versionRepositoryStub = {
          getById: sinon.stub().resolves({ id: versionId, scope: Frameworks.CORE, challengesConfiguration }),
        };

        // when
        await catchErr(simulateFlashAssessmentScenario)({
          locale,
          sharedChallengeRepository: challengeRepositoryStub,
          versionRepository: versionRepositoryStub,
          versionId,
        });

        // then
        expect(versionRepositoryStub.getById).to.have.been.calledOnce;
        const returnedVersion = await versionRepositoryStub.getById.firstCall.returnValue;
        expect(returnedVersion.challengesConfiguration).to.deep.equal(challengesConfiguration);
      });
    });

    describe('when simulating a core certification', function () {
      it('should fetch the core referential challenges', async function () {
        // given
        const locale = FRENCH_FRANCE;
        const accessibilityAdjustmentNeeded = false;
        const challengeRepositoryStub = { findActiveFlashCompatible: sinon.stub() };

        // when
        await catchErr(simulateFlashAssessmentScenario)({
          locale,
          accessibilityAdjustmentNeeded,
          complementaryCertificationKey: undefined,
          sharedChallengeRepository: challengeRepositoryStub,
        });

        // then
        expect(challengeRepositoryStub.findActiveFlashCompatible).to.have.been.calledOnceWithExactly({
          locale,
          accessibilityAdjustmentNeeded,
          version: undefined,
        });
      });
    });
  });
});
