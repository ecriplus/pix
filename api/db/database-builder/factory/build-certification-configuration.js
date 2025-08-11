import { databaseBuffer } from '../database-buffer.js';

export const buildCertificationConfiguration = function ({
  id = databaseBuffer.getNextId(),
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
      id,
      startingDate,
      expirationDate,
      challengesConfiguration: JSON.stringify({
        maximumAssessmentLength,
        challengesBetweenSameCompetence,
        limitToOneQuestionPerTube,
        enablePassageByAllCompetences,
        variationPercent,
      }),
      globalScoringConfiguration: JSON.stringify(globalScoringConfiguration),
      competencesScoringConfiguration: JSON.stringify(competencesScoringConfiguration),
    },
  });
};
