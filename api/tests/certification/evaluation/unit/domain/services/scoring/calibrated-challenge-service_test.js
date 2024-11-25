import * as calibratedChallengeService from '../../../../../../../src/certification/evaluation/domain/services/scoring/calibrated-challenge-service.js';
import { config } from '../../../../../../../src/shared/config.js';
import { domainBuilder, expect, sinon } from '../../../../../../test-helper.js';
import { generateChallengeList } from '../../../../../shared/fixtures/challenges.js';

const { minimumAnswersRequiredToValidateACertification } = config.v3Certification.scoring;

describe('Certification | Evaluation | Unit | Domain | Services | calibrated challenge service', function () {
  context('#findByCertificationCourseId', function () {
    let challengeCalibrationRepository, challengeRepository;

    let challengeList;

    beforeEach(function () {
      challengeList = generateChallengeList({ length: minimumAnswersRequiredToValidateACertification + 1 });

      challengeCalibrationRepository = {
        getByCertificationCourseId: sinon.stub().rejects(new Error('Args mismatch')),
      };

      challengeRepository = {
        findFlashCompatibleWithoutLocale: sinon
          .stub()
          .withArgs({
            useObsoleteChallenges: true,
          })
          .returns(challengeList),
        getMany: sinon.stub(),
      };
    });

    it('should return askedChallenges, allChallenges and challengeCalibrations', async function () {
      // given
      const certificationCourseId = 1234;
      const challengesAfterCalibration = challengeList.slice(1);

      const challengeExcludedFromCalibration = domainBuilder.buildChallenge({
        ...challengeList[0],
        discriminant: null,
        difficulty: null,
      });

      const expectedChallengeCalibrations = _buildDataFromAnsweredChallenges(challengeList, challengeRepository);

      const expectedAskedChallenges = [challengeExcludedFromCalibration, ...challengesAfterCalibration];

      challengeRepository.getMany.withArgs(challengeList.map((e) => e.id)).returns(expectedAskedChallenges);

      challengeCalibrationRepository.getByCertificationCourseId
        .withArgs({ certificationCourseId })
        .resolves(expectedChallengeCalibrations);

      challengeRepository.findFlashCompatibleWithoutLocale
        .withArgs({
          useObsoleteChallenges: true,
        })
        .returns(challengesAfterCalibration);

      // when
      const { allChallenges, askedChallenges, challengeCalibrations } =
        await calibratedChallengeService.findByCertificationCourseId({
          certificationCourseId,
          challengeCalibrationRepository,
          challengeRepository,
        });

      // then
      expect(challengeCalibrations).to.deep.equal(expectedChallengeCalibrations);
      expect(askedChallenges).to.deep.equal(expectedAskedChallenges);
      expect(allChallenges).to.deep.equal(challengeList);
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

const _buildDataFromAnsweredChallenges = (challengeList, challengeRepository) => {
  const challengeCalibrations = challengeList.map(_generateChallengeCalibrations);
  challengeRepository.getMany.withArgs(challengeList.map((e) => e.id)).returns(challengeList);
  return challengeCalibrations;
};
