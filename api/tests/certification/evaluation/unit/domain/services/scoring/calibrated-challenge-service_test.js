import * as calibratedChallengeService from '../../../../../../../src/certification/evaluation/domain/services/scoring/calibrated-challenge-service.js';
import { config } from '../../../../../../../src/shared/config.js';
import { DomainTransaction } from '../../../../../../../src/shared/domain/DomainTransaction.js';
import { domainBuilder, expect, sinon } from '../../../../../../test-helper.js';
import { generateChallengeList } from '../../../../../shared/fixtures/challenges.js';

const { minimumAnswersRequiredToValidateACertification } = config.v3Certification.scoring;

describe('Certification | Evaluation | Unit | Domain | Services | calibrated challenge service', function () {
  context('#findByCertificationCourseId', function () {
    let challengeCalibrationRepository,
      challengeRepository,
      certificationChallengeLiveAlertRepository,
      sharedChallengeRepository;

    let challengeList;

    beforeEach(function () {
      sinon.stub(DomainTransaction, 'execute').callsFake((callback) => {
        return callback();
      });

      challengeList = generateChallengeList({ length: minimumAnswersRequiredToValidateACertification + 1 });

      challengeCalibrationRepository = {
        getByCertificationCourseId: sinon.stub().rejects(new Error('Args mismatch')),
      };

      certificationChallengeLiveAlertRepository = {
        getLiveAlertValidatedChallengeIdsByAssessmentId: sinon.stub(),
      };

      challengeRepository = {
        findFlashCompatibleWithoutLocale: sinon
          .stub()
          .withArgs({
            useObsoleteChallenges: true,
          })
          .returns(challengeList),
      };

      sharedChallengeRepository = {
        getMany: sinon.stub(),
      };
    });

    context('when there are no validated live alerts', function () {
      it('should return askedChallenges, allChallenges and challengeCalibrations', async function () {
        // given
        const certificationCourseId = 1234;
        const assessmentId = 5678;
        const challengesAfterCalibration = challengeList.slice(1);

        const challengeExcludedFromCalibration = domainBuilder.buildChallenge({
          ...challengeList[0],
          discriminant: null,
          difficulty: null,
        });

        const expectedChallengeCalibrations = _buildDataFromAnsweredChallenges(
          challengeList,
          sharedChallengeRepository,
        );

        const expectedAskedChallenges = [challengeExcludedFromCalibration, ...challengesAfterCalibration];

        certificationChallengeLiveAlertRepository.getLiveAlertValidatedChallengeIdsByAssessmentId
          .withArgs({ assessmentId })
          .resolves([]);

        sharedChallengeRepository.getMany.withArgs(challengeList.map((e) => e.id)).returns(expectedAskedChallenges);

        challengeCalibrationRepository.getByCertificationCourseId
          .withArgs({ certificationCourseId })
          .resolves(expectedChallengeCalibrations);

        challengeRepository.findFlashCompatibleWithoutLocale
          .withArgs({
            useObsoleteChallenges: true,
          })
          .returns(challengesAfterCalibration);

        // when
        const {
          allChallenges,
          askedChallengesWithoutLiveAlerts: askedChallenges,
          challengeCalibrationsWithoutLiveAlerts: challengeCalibrations,
        } = await calibratedChallengeService.findByCertificationCourseIdAndAssessmentId({
          certificationCourseId,
          assessmentId,
          challengeCalibrationRepository,
          certificationChallengeLiveAlertRepository,
          sharedChallengeRepository,
          challengeRepository,
        });

        // then
        expect(challengeCalibrations).to.deep.equal(expectedChallengeCalibrations);
        expect(askedChallenges).to.deep.equal(expectedAskedChallenges);
        expect(allChallenges).to.deep.equal(challengeList);
      });
    });

    context('when there are validated live alerts', function () {
      it('should return asked challenges without live alerts, all challenges and challenge calibrations without live alerts', async function () {
        // given
        const certificationCourseId = 1234;
        const assessmentId = 5678;
        const challengesAfterCalibration = challengeList.slice(1);

        const challengeExcludedFromCalibration = domainBuilder.buildChallenge({
          ...challengeList[0],
          discriminant: null,
          difficulty: null,
        });

        const challengeWithValidatedLiveAlert = domainBuilder.buildChallenge({
          ...challengeList.at(-1),
        });

        const challengeCalibrations = _buildDataFromAnsweredChallenges(challengeList, sharedChallengeRepository);

        const askedChallenges = [challengeExcludedFromCalibration, ...challengesAfterCalibration];

        certificationChallengeLiveAlertRepository.getLiveAlertValidatedChallengeIdsByAssessmentId
          .withArgs({ assessmentId })
          .resolves([challengeWithValidatedLiveAlert.id]);

        sharedChallengeRepository.getMany.withArgs(challengeList.map((e) => e.id)).returns(askedChallenges);

        challengeCalibrationRepository.getByCertificationCourseId
          .withArgs({ certificationCourseId })
          .resolves(challengeCalibrations);

        challengeRepository.findFlashCompatibleWithoutLocale
          .withArgs({
            useObsoleteChallenges: true,
          })
          .returns(challengesAfterCalibration);

        const expectedAskedChallengesWithoutLiveAlerts = askedChallenges.slice(0, -1);
        const expectedChallengeCalibrations = challengeCalibrations.slice(0, -1);

        // when
        const { allChallenges, askedChallengesWithoutLiveAlerts, challengeCalibrationsWithoutLiveAlerts } =
          await calibratedChallengeService.findByCertificationCourseIdAndAssessmentId({
            certificationCourseId,
            assessmentId,
            challengeCalibrationRepository,
            certificationChallengeLiveAlertRepository,
            sharedChallengeRepository,
            challengeRepository,
          });

        // then
        expect(challengeCalibrationsWithoutLiveAlerts).to.deep.equal(expectedChallengeCalibrations);
        expect(askedChallengesWithoutLiveAlerts).to.deep.equal(expectedAskedChallengesWithoutLiveAlerts);
        expect(allChallenges).to.deep.equal(challengeList);
      });
    });
  });
});

const _generateChallengeCalibrations = ({ discriminant, difficulty, id }) => {
  return domainBuilder.certification.scoring.buildChallengeCalibration({
    id,
    discriminant,
    difficulty,
    certificationChallengeId: `certification-challenge-id-for-${id}`,
  });
};

const _buildDataFromAnsweredChallenges = (challengeList, sharedChallengeRepository) => {
  const challengeCalibrations = challengeList.map(_generateChallengeCalibrations);
  sharedChallengeRepository.getMany.withArgs(challengeList.map((e) => e.id)).returns(challengeList);
  return challengeCalibrations;
};
