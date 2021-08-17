const AssessmentResult = require('../models/AssessmentResult');
const CompetenceMark = require('../models/CompetenceMark');
const CertificationRescoringCompleted = require('./CertificationRescoringCompleted.js');
const bluebird = require('bluebird');
const {
  CertificationComputeError,
} = require('../errors');
const ChallengeNeutralized = require('./ChallengeNeutralized');
const ChallengeDeneutralized = require('./ChallengeDeneutralized');
const CertificationJuryDone = require('./CertificationJuryDone');
const { checkEventTypes } = require('./check-event-types');

const eventTypes = [ChallengeNeutralized, ChallengeDeneutralized, CertificationJuryDone];
const EMITTER = 'PIX-ALGO-NEUTRALIZATION';

async function handleCertificationRescoring({
  event,
  assessmentResultRepository,
  certificationAssessmentRepository,
  competenceMarkRepository,
  certificationResultService,
  certificationCourseRepository,
}) {
  checkEventTypes(event, eventTypes);

  const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({ certificationCourseId: event.certificationCourseId });
  return await _calculateCertificationScore({
    certificationAssessment,
    assessmentResultRepository,
    competenceMarkRepository,
    certificationResultService,
    certificationCourseRepository,
    juryId: event.juryId,
  });
}

async function _calculateCertificationScore({
  certificationAssessment,
  assessmentResultRepository,
  competenceMarkRepository,
  certificationResultService,
  certificationCourseRepository,
  juryId,
}) {
  try {
    const certificationAssessmentScore = await certificationResultService.computeResult({
      certificationAssessment,
      continueOnError: false,
    });
    await _saveResult({
      certificationAssessmentScore,
      certificationAssessment,
      assessmentResultRepository,
      competenceMarkRepository,
      certificationCourseRepository,
      juryId,
    });
    return new CertificationRescoringCompleted({
      userId: certificationAssessment.userId,
      certificationCourseId: certificationAssessment.certificationCourseId,
      reproducibilityRate: certificationAssessmentScore.percentageCorrectAnswers,
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
  assessmentResultRepository,
  competenceMarkRepository,
  certificationCourseRepository,
  juryId,
}) {
  const assessmentResult = await _createAssessmentResult({
    certificationAssessment,
    certificationAssessmentScore,
    assessmentResultRepository,
    juryId,
  });

  await bluebird.mapSeries(certificationAssessmentScore.competenceMarks, (competenceMark) => {
    const competenceMarkDomain = new CompetenceMark({ ...competenceMark, assessmentResultId: assessmentResult.id });
    return competenceMarkRepository.save(competenceMarkDomain);
  });

  const certificationCourse = await certificationCourseRepository.get(certificationAssessment.certificationCourseId);
  if (certificationAssessmentScore.hasNoCompetenceMarks()) {
    certificationCourse.cancel();
  } else {
    certificationCourse.uncancel();
  }
  await certificationCourseRepository.update(certificationCourse);
}

function _createAssessmentResult({ certificationAssessment, certificationAssessmentScore, assessmentResultRepository, juryId }) {
  const assessmentResult = AssessmentResult.buildStandardAssessmentResult({
    pixScore: certificationAssessmentScore.nbPix,
    status: certificationAssessmentScore.status,
    assessmentId: certificationAssessment.id,
    emitter: EMITTER,
    juryId,
  });
  return assessmentResultRepository.save(assessmentResult);
}

async function _saveResultAfterCertificationComputeError({
  certificationAssessment,
  assessmentResultRepository,
  certificationComputeError,
  juryId,
}) {
  const assessmentResult = AssessmentResult.buildAlgoErrorResult({
    error: certificationComputeError,
    assessmentId: certificationAssessment.id,
    juryId,
    emitter: EMITTER,
  });
  await assessmentResultRepository.save(assessmentResult);
}

handleCertificationRescoring.eventTypes = eventTypes;
module.exports = handleCertificationRescoring;
