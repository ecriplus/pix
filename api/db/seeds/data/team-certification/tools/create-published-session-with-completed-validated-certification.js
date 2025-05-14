import i18n from 'i18n';

import { usecases as enrolmentUseCases } from '../../../../../src/certification/enrolment/domain/usecases/index.js';
import pickChallengeService from '../../../../../src/certification/evaluation/domain/services/pick-challenge-service.js';
import { usecases as evaluationUseCases } from '../../../../../src/certification/evaluation/domain/usecases/index.js';
import { usecases as flashUseCases } from '../../../../../src/certification/flash-certification/domain/usecases/index.js';
import { usecases as scoringUseCases } from '../../../../../src/certification/scoring/domain/usecases/index.js';
import { usecases as sessionManagementUseCases } from '../../../../../src/certification/session-management/domain/usecases/index.js';
import { ABORT_REASONS } from '../../../../../src/certification/shared/domain/models/CertificationCourse.js';
import { CertificationReport } from '../../../../../src/certification/shared/domain/models/CertificationReport.js';
import { pickAnswerStatusService } from '../../../../../src/certification/shared/domain/services/pick-answer-status-service.js';
import { config } from '../../../../../src/shared/config.js';
import { LOCALE } from '../../../../../src/shared/domain/constants.js';
import { LANGUAGES_CODE } from '../../../../../src/shared/domain/services/language-service.js';

/**
 * @param {Object} params
 * @param {number} params.sessionId
 * @param {number} params.candidateId
 * @param {number} params.pixScoreTarget - WARNING: final certification pix score will vary
 *                                   because simulation simulates a few user errors
 */
export default async function publishSessionWithCompletedValidatedCertification({
  databaseBuilder,
  sessionId,
  candidateId,
  pixScoreTarget,
}) {
  const session = await enrolmentUseCases.getSession({ sessionId });
  const candidate = await enrolmentUseCases.getCandidate({ certificationCandidateId: candidateId });

  const { certificationCourse } = await evaluationUseCases.retrieveLastOrCreateCertificationCourse({
    sessionId,
    accessCode: session.accessCode,
    userId: candidate.userId,
    locale: LANGUAGES_CODE.FRENCH,
  });

  const assessment = certificationCourse._assessment;

  const { capacity } = await scoringUseCases.simulateCapacityFromScore({
    score: pixScoreTarget,
    date: new Date(),
  });
  const pickAnswerStatus = pickAnswerStatusService.pickAnswerStatusForCapacity(capacity);
  const pickChallenge = pickChallengeService.getChallengePicker(
    config.v3Certification.defaultProbabilityToPickChallenge,
  );
  const simulatedCertification = await flashUseCases.simulateFlashAssessmentScenario({
    locale: LOCALE.FRENCH_SPOKEN,
    pickChallenge,
    pickAnswerStatus,
    initialCapacity: config.v3Certification.defaultCandidateCapacity,
  });

  for (const simulatedChallenge of simulatedCertification) {
    databaseBuilder.factory.buildCertificationChallenge({
      associatedSkillName: simulatedChallenge.challenge.skill.name,
      associatedSkillId: simulatedChallenge.challenge.skill.id,
      challengeId: simulatedChallenge.challenge.id,
      competenceId: simulatedChallenge.challenge.skill.competenceId,
      courseId: certificationCourse._id,
      createdAt: session.date,
      updatedAt: session.date,
      isNeutralized: false,
      hasBeenSkippedAutomatically: false,
      certifiableBadgeKey: null,
      difficulty: simulatedChallenge.challenge.difficulty,
      discriminant: simulatedChallenge.challenge.discriminant,
    });

    databaseBuilder.factory.buildAnswer({
      value: 'dummy value',
      result: simulatedChallenge.answerStatus,
      assessmentId: assessment.id,
      challengeId: simulatedChallenge.challenge.id,
      createdAt: session.date,
      updatedAt: session.date,
      timeout: null,
      resultDetails: 'dummy value',
    });
  }

  await databaseBuilder.commit();

  const report = new CertificationReport({
    certificationCourseId: certificationCourse._id,
    isCompleted: false,
    abortReason: ABORT_REASONS.TECHNICAL,
  });

  databaseBuilder.factory.buildCertificationReport({ sessionId, ...report });

  await databaseBuilder.commit();

  const sessionFinalized = await sessionManagementUseCases.finalizeSession({
    sessionId,
    examinerGlobalComment: 'dummy comment',
    hasIncident: false,
    hasJoiningIssue: false,
    certificationReports: [report],
  });

  const autoJuryDone = await sessionManagementUseCases.processAutoJury({ sessionFinalized });

  await sessionManagementUseCases.registerPublishableSession({ autoJuryDone });

  await databaseBuilder.commit();

  await sessionManagementUseCases.publishSession({ sessionId, i18n });
}
