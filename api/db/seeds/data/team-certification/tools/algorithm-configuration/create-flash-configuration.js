export const createV3CertificationConfiguration = ({ databaseBuilder }) => {
  databaseBuilder.factory.buildCertificationConfiguration({
    challengesConfiguration: {
      maximumAssessmentLength: 32,
      challengesBetweenSameCompetence: null,
      limitToOneQuestionPerTube: true,
      enablePassageByAllCompetences: true,
      variationPercent: 0.5,
    },
    startingDate: new Date('1977-10-19'),
  });
};
