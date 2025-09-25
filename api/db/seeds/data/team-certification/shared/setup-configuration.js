import { createCertificationConfiguration } from '../tools/algorithm-configuration/create-certification-configuration.js';
import { createIssueReportCategories } from '../tools/algorithm-configuration/create-issue-report-categories.js';

export async function setupConfigurations({ databaseBuilder }) {
  await createCertificationConfiguration({ databaseBuilder });

  await createIssueReportCategories({ databaseBuilder });

  await databaseBuilder.commit();
}
