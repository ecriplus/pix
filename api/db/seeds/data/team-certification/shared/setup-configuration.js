import { createIssueReportCategories } from '../tools/algorithm-configuration/create-issue-report-categories.js';

export async function setupConfigurations({ databaseBuilder }) {
  await createIssueReportCategories({ databaseBuilder });

  await databaseBuilder.commit();
}
