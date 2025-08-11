import { databaseBuffer } from '../database-buffer.js';

const defaultChallengesConfiguration = {
  maximumAssessmentLength: 20,
  challengesBetweenSameCompetence: null,
  limitToOneQuestionPerTube: false,
  enablePassageByAllCompetences: false,
  variationPercent: 0.5,
};

const defaultGlobalScoringConfiguration = [
  { bounds: { max: -2.6789, min: -5.12345 }, meshLevel: 0 },
  { bounds: { max: -0.23456, min: -2.6789 }, meshLevel: 1 },
  { bounds: { max: 0.78901, min: -0.23456 }, meshLevel: 2 },
  { bounds: { max: 1.34567, min: 0.78901 }, meshLevel: 3 },
  { bounds: { max: 2.89012, min: 1.34567 }, meshLevel: 4 },
  { bounds: { max: 2.45678, min: 2.89012 }, meshLevel: 5 },
  { bounds: { max: 4.90123, min: 2.45678 }, meshLevel: 6 },
  { bounds: { max: 6.56789, min: 4.90123 }, meshLevel: 7 },
];
const defaultCompetencesScoringConfiguration = [
  {
    competence: '1.1',
    values: [
      {
        bounds: {
          max: 0,
          min: -5,
        },
        competenceLevel: 0,
      },
      {
        bounds: {
          max: 5,
          min: 0,
        },
        competenceLevel: 1,
      },
    ],
  },
];

export const buildCertificationConfiguration = function ({
  id = databaseBuffer.getNextId(),
  startingDate = new Date('2018-01-01'),
  expirationDate = null,
  challengesConfiguration = defaultChallengesConfiguration,
  globalScoringConfiguration = defaultGlobalScoringConfiguration,
  competencesScoringConfiguration = defaultCompetencesScoringConfiguration,
} = {}) {
  return databaseBuffer.pushInsertable({
    tableName: 'certification-configurations',
    values: {
      id,
      startingDate,
      expirationDate,
      challengesConfiguration: JSON.stringify(challengesConfiguration),
      globalScoringConfiguration: JSON.stringify(globalScoringConfiguration),
      competencesScoringConfiguration: JSON.stringify(competencesScoringConfiguration),
    },
  });
};
