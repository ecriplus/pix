import { ScoOrganizationTagName } from '../../../src/certification/configuration/domain/models/ScoOrganizationTagName.js';
import { databaseBuffer } from '../database-buffer.js';

const buildScoBlockedAccessDates = function ({
  collegeDate = new Date('2025-11-15'),
  lyceeDate = new Date('2025-10-15'),
} = {}) {
  databaseBuffer.pushInsertable({
    tableName: 'certification_sco_blocked_access_dates',
    values: {
      scoOrganizationTagName: ScoOrganizationTagName.COLLEGE,
      reopeningDate: collegeDate,
    },
  });
  databaseBuffer.pushInsertable({
    tableName: 'certification_sco_blocked_access_dates',
    values: {
      scoOrganizationTagName: ScoOrganizationTagName.LYCEE,
      reopeningDate: lyceeDate,
    },
  });

  return {
    collegeDate,
    lyceeDate,
  };
};

export { buildScoBlockedAccessDates };
