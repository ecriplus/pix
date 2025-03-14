import { JurySessionCounters } from '../../../../../../src/certification/session-management/domain/read-models/JurySessionCounters.js';

export const buildJurySessionCounters = function ({
  startedCertifications,
  certificationsWithScoringError,
  issueReports,
} = {}) {
  return new JurySessionCounters({ startedCertifications, certificationsWithScoringError, issueReports });
};
