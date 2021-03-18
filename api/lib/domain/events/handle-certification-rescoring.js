const AssessmentResult = require('../models/AssessmentResult');
const CompetenceMark = require('../models/CompetenceMark');
const bluebird = require('bluebird');
const {
  CertificationComputeError,
} = require('../errors');
const ChallengeNeutralized = require('./ChallengeNeutralized');
const { checkEventType } = require('./check-event-type');

const eventType = ChallengeNeutralized;

async function handleCertificationRescoring({
  domainTransaction,
  event,
  assessmentResultRepository,
  certificationAssessmentRepository,
  competenceMarkRepository,
  scoringCertificationService,
}) {
  checkEventType(event, eventType);

  const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId(event.certificationCourseId);
  await _calculateCertificationScore({
    certificationAssessment,
    domainTransaction,
    assessmentResultRepository,
    competenceMarkRepository,
    scoringCertificationService,
    juryId: event.juryId,
  });
  return null;
}

async function _calculateCertificationScore({
  certificationAssessment,
  domainTransaction,
  assessmentResultRepository,
  competenceMarkRepository,
  scoringCertificationService,
  juryId,
}) {
  try {
    const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore(certificationAssessment);
    await _saveResult({
      certificationAssessmentScore,
      certificationAssessment,
      domainTransaction,
      assessmentResultRepository,
      competenceMarkRepository,
      juryId,
    });
  } catch (error) {
    if (!(error instanceof CertificationComputeError)) {
      throw error;
    }
    await _saveResultAfterCertificationComputeError({
      certificationAssessment,
      assessmentResultRepository,
      certificationComputeError: error,
      juryId,
    });
  }
}

async function _saveResult({
  certificationAssessment,
  certificationAssessmentScore,
  domainTransaction,
  assessmentResultRepository,
  competenceMarkRepository,
  juryId,
}) {
  const assessmentResult = await _createAssessmentResult({
    certificationAssessment,
    certificationAssessmentScore,
    assessmentResultRepository,
    domainTransaction,
    juryId,
  });

  await bluebird.mapSeries(certificationAssessmentScore.competenceMarks, (competenceMark) => {
    const competenceMarkDomain = new CompetenceMark({ ...competenceMark, ...{ assessmentResultId: assessmentResult.id } });
    return competenceMarkRepository.save(competenceMarkDomain, domainTransaction);
  });
}

function _createAssessmentResult({ certificationAssessment, certificationAssessmentScore, assessmentResultRepository, domainTransaction, juryId }) {
  const assessmentResult = AssessmentResult.buildStandardAssessmentResult(certificationAssessmentScore.nbPix, certificationAssessmentScore.status, certificationAssessment.id, juryId);
  return assessmentResultRepository.save(assessmentResult, domainTransaction);
}

async function _saveResultAfterCertificationComputeError({
  certificationAssessment,
  assessmentResultRepository,
  certificationComputeError,
  juryId,
}) {
  const assessmentResult = AssessmentResult.buildAlgoErrorResult(certificationComputeError, certificationAssessment.id, juryId);
  await assessmentResultRepository.save(assessmentResult);
}

handleCertificationRescoring.eventType = eventType;
module.exports = handleCertificationRescoring;
