import i18n from 'i18n';
import _ from 'lodash';

import { usecases as enrolmentUseCases } from '../../../../../src/certification/enrolment/domain/usecases/index.js';
import { usecases as evaluationUseCases } from '../../../../../src/certification/evaluation/domain/usecases/index.js';
import { usecases as sessionManagementUseCases } from '../../../../../src/certification/session-management/domain/usecases/index.js';
import { CertificationReport } from '../../../../../src/certification/shared/domain/models/CertificationReport.js';
import * as learningContent from '../../common/tooling/learning-content.js';

export default async function makeCandidatePassCertification({
  databaseBuilder,
  sessionId,
  candidateId,
  isCertificationSucceeded = true,
}) {
  const session = await enrolmentUseCases.getSession({ sessionId });
  const candidate = await enrolmentUseCases.getCandidate({ certificationCandidateId: candidateId });

  // Create assessment
  const { certificationCourse } = await evaluationUseCases.retrieveLastOrCreateCertificationCourse({
    sessionId,
    accessCode: session.accessCode,
    userId: candidate.userId,
    locale: 'fr',
  });

  const assessment = certificationCourse._assessment;

  // Pass certification
  const pixCompetences = await learningContent.getCoreCompetences();

  const coreProfileData = {};

  for (const competence of pixCompetences) {
    coreProfileData[competence.id] = {
      threeMostDifficultSkillsAndChallenges: [],
      pixScore: 0,
      competence,
    };
    const skills = await learningContent.findActiveSkillsByCompetenceId(competence.id);
    const orderedSkills = skills
      .sort((a, b) => a.difficulty - b.difficulty)
      .filter(({ difficulty }) => difficulty <= 8);

    for (const skill of orderedSkills) {
      const challenge = await learningContent.findFirstValidatedChallengeBySkillId(skill.id);
      if (!challenge) {
        continue;
      }

      coreProfileData[competence.id].threeMostDifficultSkillsAndChallenges.push({ challenge, skill });

      const answerId = databaseBuilder.factory.buildAnswer({
        value: 'dummy value',
        result: 'ok',
        assessmentId: assessment.id,
        challengeId: challenge.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        timeout: null,
        resultDetails: 'dummy value',
      }).id;
      databaseBuilder.factory.buildKnowledgeElement({
        source: 'direct',
        status: 'validated',
        answerId,
        assessmentId: assessment.id,
        skillId: skill.id,
        createdAt: new Date(),
        earnedPix: skill.pixValue,
        userId: candidate.userId,
        competenceId: skill.competenceId,
      });

      coreProfileData[competence.id].pixScore = Math.floor(Math.random() * 55) + 1;
    }
    coreProfileData[competence.id].threeMostDifficultSkillsAndChallenges = _.takeRight(
      coreProfileData[competence.id].threeMostDifficultSkillsAndChallenges,
      3,
    );
    coreProfileData[competence.id].pixScore = Math.ceil(coreProfileData[competence.id].pixScore);
  }

  // Create assessment result
  let assessmentResultPixScore = 0;
  for (const competenceData of Object.values(coreProfileData)) {
    assessmentResultPixScore += competenceData.pixScore;
  }

  const assessmentResult = databaseBuilder.factory.buildAssessmentResult({
    pixScore: isCertificationSucceeded ? assessmentResultPixScore : 48,
    reproducibilityRate: 100,
    status: 'validated',
    commentForCandidate: '',
    commentForOrganization: '',
    juryId: null,
    assessmentId: assessment.id,
    createdAt: session.date,
    certificationCourseId: certificationCourse._id,
  });

  databaseBuilder.factory.buildCertificationCourseLastAssessmentResult({
    certificationCourseId: certificationCourse._id,
    lastAssessmentResultId: assessmentResult.id,
  });

  // Create competence marks
  for (const competenceData of Object.values(coreProfileData)) {
    databaseBuilder.factory.buildCompetenceMark({
      level: Math.floor(competenceData.pixScore / 8),
      score: competenceData.pixScore,
      area_code: `${competenceData.competence.index[0]}`,
      competence_code: `${competenceData.competence.index}`,
      competenceId: competenceData.competence.id,
      assessmentResultId: assessmentResult.id,
      createdAt: session.date,
    });

    // Create certification challenges and answers
    for (const { challenge, skill } of competenceData.threeMostDifficultSkillsAndChallenges) {
      databaseBuilder.factory.buildCertificationChallenge({
        associatedSkillName: skill.name,
        associatedSkillId: skill.id,
        challengeId: challenge.id,
        competenceId: skill.competenceId,
        courseId: certificationCourse._id,
        createdAt: session.date,
        updatedAt: session.date,
        isNeutralized: false,
        hasBeenSkippedAutomatically: false,
        certifiableBadgeKey: null,
      });
      databaseBuilder.factory.buildAnswer({
        value: 'dummy value',
        result: 'ok',
        assessmentId: assessment.id,
        challengeId: challenge.id,
        createdAt: session.date,
        updatedAt: session.date,
        timeout: null,
        resultDetails: 'dummy value',
      });
    }
  }

  await databaseBuilder.commit();

  // Finalize session
  const report = new CertificationReport({
    certificationCourseId: certificationCourse._id,
    isCompleted: false,
    abortReason: 'technical',
  });

  databaseBuilder.factory.buildCertificationReport({ sessionId, ...report });

  await databaseBuilder.commit();

  await sessionManagementUseCases.finalizeSession({
    sessionId,
    examinerGlobalComment: 'dummy comment',
    hasIncident: false,
    hasJoiningIssue: false,
    certificationReports: [report],
  });

  databaseBuilder.factory.buildFinalizedSession({
    sessionId,
    isPublishable: true,
    finalizedAt: new Date(),
    date: session.date,
    time: session.time,
    publishedAt: new Date(),
    assignedCertificationOfficerName: 'Mariah Carey',
  });

  await databaseBuilder.commit();

  await sessionManagementUseCases.publishSession({ sessionId, i18n });
}
