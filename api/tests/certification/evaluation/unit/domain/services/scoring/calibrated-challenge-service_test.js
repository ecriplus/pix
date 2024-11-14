import * as calibratedChallengeService from '../../../../../../../src/certification/evaluation/domain/services/scoring/calibrated-challenge-service.js';
import { CertificationChallengeForScoring } from '../../../../../../../src/certification/scoring/domain/models/CertificationChallengeForScoring.js';
import { config } from '../../../../../../../src/shared/config.js';
import { domainBuilder, expect, sinon } from '../../../../../../test-helper.js';
import { generateChallengeList } from '../../../../../shared/fixtures/challenges.js';

const { minimumAnswersRequiredToValidateACertification } = config.v3Certification.scoring;

describe('Certification | Evaluation | Unit | Domain | Services | calibrated challenge service', function () {
  context('#findByCertificationCourseIdForScoring', function () {
    let certificationChallengeForScoringRepository, challengeRepository;

    let challengeList;

    beforeEach(function () {
      challengeList = generateChallengeList({ length: minimumAnswersRequiredToValidateACertification + 1 });

      certificationChallengeForScoringRepository = {
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

    it('should return askedChallenges, allChallenges and certificationChallengesForScoring', async function () {
      // given
      const certificationCourseId = 1234;
      const challengesAfterCalibration = challengeList.slice(1);

      const challengeExcludedFromCalibration = domainBuilder.buildChallenge({
        ...challengeList[0],
        discriminant: null,
        difficulty: null,
      });

      const expectedCertificationChallengesForScoring = _buildDataFromAnsweredChallenges(
        challengeList,
        challengeRepository,
      );

      const expectedAskedChallenges = [challengeExcludedFromCalibration, ...challengesAfterCalibration];

      challengeRepository.getMany.withArgs(challengeList.map((e) => e.id)).returns(expectedAskedChallenges);

      certificationChallengeForScoringRepository.getByCertificationCourseId
        .withArgs({ certificationCourseId })
        .resolves(expectedCertificationChallengesForScoring);

      challengeRepository.findFlashCompatibleWithoutLocale
        .withArgs({
          useObsoleteChallenges: true,
        })
        .returns(challengesAfterCalibration);

      // when
      const { allChallenges, askedChallenges, certificationChallengesForScoring } =
        await calibratedChallengeService.findByCertificationCourseIdForScoring({
          certificationCourseId,
          certificationChallengeForScoringRepository,
          challengeRepository,
        });

      // then
      expect(certificationChallengesForScoring).to.deep.equal(expectedCertificationChallengesForScoring);
      expect(askedChallenges).to.deep.equal(expectedAskedChallenges);
      expect(allChallenges).to.deep.equal(challengeList);
    });
  });
});

const _generateCertificationChallengeForChallenge = ({ discriminant, difficulty, id }) => {
  return new CertificationChallengeForScoring({
    id,
    discriminant,
    difficulty,
    certificationChallengeId: `certification-challenge-id-for-${id}`,
  });
};

const _buildDataFromAnsweredChallenges = (challengeList, challengeRepository) => {
  const certificationChallengesForScoring = challengeList.map(_generateCertificationChallengeForChallenge);

  challengeRepository.getMany.withArgs(challengeList.map((e) => e.id)).returns(challengeList);

  return certificationChallengesForScoring;
};
