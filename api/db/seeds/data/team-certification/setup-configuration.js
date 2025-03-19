import { createCompetenceScoringConfiguration } from './create-competence-scoring-configuration.js';
import { createIssueReportCategories } from './create-issue-report-categories.js';
import { createScoringConfiguration } from './create-scoring-configuration.js';

export async function setupConfigurations({ databaseBuilder }) {
  _createV3CertificationConfiguration({ databaseBuilder });
  createCompetenceScoringConfiguration({ databaseBuilder });
  createScoringConfiguration({ databaseBuilder });
  await createIssueReportCategories({ databaseBuilder });
}

function _createV3CertificationConfiguration({ databaseBuilder }) {
  databaseBuilder.factory.buildFlashAlgorithmConfiguration({
    maximumAssessmentLength: 32,
    challengesBetweenSameCompetence: null,
    limitToOneQuestionPerTube: true,
    enablePassageByAllCompetences: true,
    variationPercent: 0.5,
    createdAt: new Date('1977-10-19'),
  });
}
