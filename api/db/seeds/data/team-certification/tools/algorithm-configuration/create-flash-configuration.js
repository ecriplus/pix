export const createV3CertificationConfiguration = ({ databaseBuilder }) => {
  databaseBuilder.factory.buildFlashAlgorithmConfiguration({
    maximumAssessmentLength: 32,
    challengesBetweenSameCompetence: null,
    limitToOneQuestionPerTube: true,
    enablePassageByAllCompetences: true,
    variationPercent: 0.5,
    createdAt: new Date('1977-10-19'),
  });
};
