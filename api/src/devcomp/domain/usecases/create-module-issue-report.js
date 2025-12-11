import { ModuleIssueReport } from '../models/module/ModuleIssueReport.js';

const createModuleIssueReport = async function ({ moduleIssueReport, moduleIssueReportRepository } = {}) {
  const moduleIssueReportToSave = new ModuleIssueReport({ ...moduleIssueReport });
  return moduleIssueReportRepository.save(moduleIssueReportToSave);
};

export { createModuleIssueReport };
