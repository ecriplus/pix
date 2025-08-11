import { databaseBuffer } from '../database-buffer.js';

export const buildCertificationConfiguration = function ({
  startingDate = new Date('2018-01-01'),
  expirationDate = null,
  maximumAssessmentLength = 20,
  challengesBetweenSameCompetence = null,
  limitToOneQuestionPerTube = false,
  enablePassageByAllCompetences = false,
  variationPercent = 0.5,
  globalScoringConfiguration = null,
  competencesScoringConfiguration = null,
} = {}) {
  return databaseBuffer.pushInsertable({
    tableName: 'certification-configurations',
    values: {
      startingDate,
      expirationDate,
      maximumAssessmentLength,
      challengesBetweenSameCompetence,
      limitToOneQuestionPerTube,
      enablePassageByAllCompetences,
      variationPercent,
      'global-scoring-configuration': JSON.stringify(globalScoringConfiguration),
      'competences-scoring-configuration': JSON.stringify(competencesScoringConfiguration),
    },
  });
};
