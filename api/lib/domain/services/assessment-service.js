const _ = require('lodash');

const courseRepository = require('../../infrastructure/repositories/course-repository');
const answerRepository = require('../../infrastructure/repositories/answer-repository');
const assessmentRepository = require('../../infrastructure/repositories/assessment-repository');
const challengeRepository = require('../../infrastructure/repositories/challenge-repository');
const skillRepository = require('../../infrastructure/repositories/skill-repository');
const competenceRepository = require('../../infrastructure/repositories/competence-repository');
const answerService = require('../services/answer-service');
const certificationService = require('../services/certification-service');
const CompetenceMark = require('../../domain/models/CompetenceMark');
const scoring  = require('../strategies/scoring/scoring');
const { NotFoundError } = require('../../domain/errors');

// FIXME: Devrait plutot 1) splitter entre les calculs des acquis 2) calcul du result
/**
 * @deprecated since getSkillsReport and getCompetenceMarks
 */
async function fetchAssessment(assessmentId) {

  const assessment = await assessmentRepository.get(assessmentId);

  if (!assessment) {
    return Promise.reject(new NotFoundError(`Unable to find assessment with ID ${assessmentId}`));
  }

  const answers = await answerRepository.findByAssessment(assessmentId);

  assessment.estimatedLevel = 0;
  assessment.pixScore = 0;
  assessment.successRate = answerService.getAnswersSuccessRate(answers);

  if (!assessment.hasTypePlacement()) {
    return Promise.resolve(assessment);
  }

  const course = await courseRepository.get(assessment.courseId);

  const [competenceSkills, challenges] = await Promise.all([
    skillRepository.findByCompetenceId(course.competences[0]),
    challengeRepository.findByCompetenceId(course.competences[0])
  ]);

  course.competenceSkills = competenceSkills;
  course.computeTubes(course.competenceSkills);

  const validatedSkills = scoring.getValidatedSkills(answers, challenges, course.tubes);

  assessment.pixScore = scoring.computeObtainedPixScore(course.competenceSkills, validatedSkills);
  assessment.estimatedLevel = scoring.computeLevel(assessment.pixScore);

  return Promise.resolve(assessment);
}

async function getSkillsReportAndCompetenceMarks(assessment) {
  if (!assessment) {
    return Promise.reject(new NotFoundError('Unable to get skills report nor competences mark without assessment'));
  }
  const response = {
    skills: {
      assessmentId: assessment.id,
      validatedSkills: [],
      failedSkills: []
    },
    competenceMarks: []
  };

  if (!assessment.canBeScored()) {
    return Promise.resolve(response);
  }

  const course = await courseRepository.get(assessment.courseId);

  const [competenceSkills, answers, challenges] = await Promise.all([
    skillRepository.findByCompetenceId(course.competences[0]),
    answerRepository.findByAssessment(assessment.id),
    challengeRepository.findByCompetenceId(course.competences[0]),
  ]);

  course.competenceSkills = competenceSkills;
  course.computeTubes(course.competenceSkills);

  const validatedSkills = scoring.getValidatedSkills(answers, challenges, course.tubes);
  const failedSkills = scoring.getFailedSkills(answers, challenges, course.tubes);

  response.skills.validatedSkills = validatedSkills;
  response.skills.failedSkills = failedSkills;

  if (assessment.hasTypeCertification()) {
    await Promise.all([
      competenceRepository.list(),
      certificationService.calculateCertificationResultByAssessmentId(assessment.id)
    ]).then(([competences, { competencesWithMark }]) => {
      response.competenceMarks = competencesWithMark.map((certifiedCompetence) => {

        const area_code = _(competences).find((competence) => {
          return competence.index === certifiedCompetence.index;
        }).area.code;

        return new CompetenceMark({
          level: certifiedCompetence.obtainedLevel,
          score: certifiedCompetence.obtainedScore,
          area_code,
          competence_code: certifiedCompetence.index,
        });
      });
    });

    return Promise.resolve(response);
  }

  if (assessment.hasTypePlacement()) {
    const competencePixScore = scoring.computeObtainedPixScore(course.competenceSkills, validatedSkills);
    const competenceLevel = scoring.computeLevel(competencePixScore);

    const competence = await competenceRepository.get(course.competences[0]);

    const competenceMark = new CompetenceMark({
      level: competenceLevel,
      score: competencePixScore,
      area_code: competence.area.code,
      competence_code: competence.index
    });

    response.competenceMarks = [competenceMark];

    return Promise.resolve(response);
  }
}

module.exports = {
  fetchAssessment,
  getSkillsReportAndCompetenceMarks
};
