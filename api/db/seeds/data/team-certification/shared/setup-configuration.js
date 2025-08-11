import { createCertificationConfiguration } from '../tools/algorithm-configuration/create-certification-configuration.js';
import { createCompetenceScoringConfiguration } from '../tools/algorithm-configuration/create-competence-scoring-configuration.js';
import { createV3CertificationConfiguration } from '../tools/algorithm-configuration/create-flash-configuration.js';
import { createIssueReportCategories } from '../tools/algorithm-configuration/create-issue-report-categories.js';
import { createScoringConfiguration } from '../tools/algorithm-configuration/create-scoring-configuration.js';

export async function setupConfigurations({ databaseBuilder }) {
  await createV3CertificationConfiguration({ databaseBuilder });
  await createCompetenceScoringConfiguration({ databaseBuilder });
  await createScoringConfiguration({ databaseBuilder });

  await createCertificationConfiguration({ databaseBuilder });

  await createIssueReportCategories({ databaseBuilder });

  await databaseBuilder.commit();
}
