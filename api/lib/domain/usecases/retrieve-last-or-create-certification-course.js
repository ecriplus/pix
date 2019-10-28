const CertificationCourse = require('../models/CertificationCourse');
const Assessment = require('../models/Assessment');
const { UserNotAuthorizedToCertifyError, NotFoundError } = require('../errors');

module.exports = async function retrieveLastOrCreateCertificationCourse({
  accessCode,
  userId,
  sessionRepository,
  userService,
  certificationCandidateRepository,
  certificationChallengesService,
  certificationCourseRepository,
  assessmentRepository,
}) {
  const { id: sessionId } = await sessionRepository.getByAccessCode(accessCode);
  try {
    const certificationCourse = await certificationCourseRepository.getLastCertificationCourseByUserIdAndSessionId(userId, sessionId);
    return {
      created: false,
      certificationCourse,
    };
  } catch (err) {
    if (err instanceof NotFoundError) {
      return _startNewCertification({
        userId,
        sessionId,
        userService,
        certificationCandidateRepository,
        certificationChallengesService,
        certificationCourseRepository,
        assessmentRepository,
      });
    }

    throw err;
  }
};

async function _startNewCertification({
  userId,
  sessionId,
  userService,
  certificationChallengesService,
  certificationCandidateRepository,
  certificationCourseRepository,
  assessmentRepository,
}) {
  const certificationProfile = await userService.getCertificationProfile({ userId, limitDate: new Date() });

  if (!certificationProfile.isCertifiable()) {
    throw new UserNotAuthorizedToCertifyError();
  }
  await userService.fillCertificationProfileWithCertificationChallenges(certificationProfile);

  try {
    const certificationCourse = await certificationCourseRepository.getLastCertificationCourseByUserIdAndSessionId(userId, sessionId);
    return {
      created: false,
      certificationCourse,
    };
  } catch (err) {
    if (err instanceof NotFoundError) {
      const { firstName, lastName, birthdate, birthCity: birthplace } = await certificationCandidateRepository.getBySessionIdAndUserId({ sessionId, userId });
      const newCertificationCourse = new CertificationCourse({
        userId,
        sessionId,
        firstName,
        lastName,
        birthdate,
        birthplace,
        isV2Certification: true,
      });
      const savedCertificationCourse = await certificationCourseRepository.save(newCertificationCourse);
      await _createAssessmentForCertificationCourse({ userId, certificationCourseId: savedCertificationCourse.id, assessmentRepository });
      return {
        created: true,
        certificationCourse: await certificationChallengesService.saveChallenges(certificationProfile.userCompetences, savedCertificationCourse),
      };
    }

    throw err;
  }
}

function _createAssessmentForCertificationCourse({ userId, certificationCourseId, assessmentRepository }) {
  const assessment = new Assessment({
    userId,
    courseId: certificationCourseId,
    state: Assessment.states.STARTED,
    type: Assessment.types.CERTIFICATION,
  });

  return assessmentRepository.save(assessment);
}

