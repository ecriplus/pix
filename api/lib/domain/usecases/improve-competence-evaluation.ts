// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MAX_REACHA... Remove this comment to see the full error message
const { MAX_REACHABLE_LEVEL } = require('../constants');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ImproveCom... Remove this comment to see the full error message
const { ImproveCompetenceEvaluationForbiddenError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function improveCompetenceEvaluation({
  competenceEvaluationRepository,
  getCompetenceLevel,
  assessmentRepository,
  userId,
  competenceId,
  domainTransaction
}: $TSFixMe) {
  let competenceEvaluation = await competenceEvaluationRepository.getByCompetenceIdAndUserId({
    competenceId,
    userId,
    domainTransaction,
    forUpdate: true,
  });

  if (competenceEvaluation.assessment.isStarted() && competenceEvaluation.assessment.isImproving) {
    return { ...competenceEvaluation, assessmentId: competenceEvaluation.assessmentId };
  }

  const competenceLevel = await getCompetenceLevel({ userId, competenceId });

  if (competenceLevel === MAX_REACHABLE_LEVEL) {
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    throw new ImproveCompetenceEvaluationForbiddenError();
  }

  const assessment = Assessment.createImprovingForCompetenceEvaluation({ userId, competenceId });

  const { id: assessmentId } = await assessmentRepository.save({ assessment, domainTransaction });

  competenceEvaluation = await competenceEvaluationRepository.updateAssessmentId({
    currentAssessmentId: competenceEvaluation.assessmentId,
    newAssessmentId: assessmentId,
    domainTransaction,
  });

  return { ...competenceEvaluation, assessmentId };
};
