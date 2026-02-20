import { CertificationAssessmentScore } from '../../../../src/certification/evaluation/domain/models/CertificationAssessmentScore.js';

const buildCertificationAssessmentScore = function ({
  competenceMarks = [],
  percentageCorrectAnswers = 0,
  hasEnoughNonNeutralizedChallengesToBeTrusted = true,
} = {}) {
  return new CertificationAssessmentScore({
    competenceMarks,
    percentageCorrectAnswers,
    hasEnoughNonNeutralizedChallengesToBeTrusted,
  });
};

export { buildCertificationAssessmentScore };
