import { getNextChallengeForV2Certification } from '../../../../../../src/certification/evaluation/domain/usecases/get-next-challenge-for-v2-certification.js';
import { Assessment } from '../../../../../../src/shared/domain/models/Assessment.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Domain | Use Cases | get-next-challenge-for-v2-certification', function () {
  describe('#getNextChallengeForV2Certification', function () {
    let sessionManagementCertificationChallengeRepository;
    let challengeRepository;
    let certificationCourseRepository;

    beforeEach(function () {
      certificationCourseRepository = { get: sinon.stub() };
      sessionManagementCertificationChallengeRepository = {
        getNextNonAnsweredChallengeByCourseId: sinon.stub().resolves(),
      };
      challengeRepository = { get: sinon.stub().resolves() };
    });

    it('should use the assessmentService to select the next CertificationChallenge', async function () {
      // given
      const nextChallenge = Symbol('nextChallenge');
      const assessment = new Assessment({ id: 156, certificationCourseId: 54516 });
      const certificationCourse = domainBuilder.buildCertificationCourse();

      sessionManagementCertificationChallengeRepository.getNextNonAnsweredChallengeByCourseId.resolves(nextChallenge);
      certificationCourseRepository.get.withArgs(assessment.certificationCourseId).resolves(certificationCourse);

      // when
      await getNextChallengeForV2Certification({
        assessment,
        sessionManagementCertificationChallengeRepository,
        challengeRepository,
      });

      // then
      expect(
        sessionManagementCertificationChallengeRepository.getNextNonAnsweredChallengeByCourseId,
      ).to.have.been.calledWithExactly(156, 54516);
    });

    it('should return the next Challenge', async function () {
      // given
      const challengeId = 15167432;
      const nextChallengeToAnswer = Symbol('nextChallengeToAnswer');
      const nextCertificationChallenge = { challengeId };
      const assessment = new Assessment({ id: 156, courseId: 54516 });
      const certificationCourse = domainBuilder.buildCertificationCourse();

      sessionManagementCertificationChallengeRepository.getNextNonAnsweredChallengeByCourseId.resolves(
        nextCertificationChallenge,
      );
      challengeRepository.get.resolves(nextChallengeToAnswer);
      certificationCourseRepository.get.withArgs(assessment.certificationCourseId).resolves(certificationCourse);

      // when
      const challenge = await getNextChallengeForV2Certification({
        assessment,
        sessionManagementCertificationChallengeRepository,
        challengeRepository,
      });

      // then
      expect(challenge).to.equal(nextChallengeToAnswer);
      expect(challengeRepository.get).to.have.been.calledWithExactly(challengeId);
    });
  });
});
