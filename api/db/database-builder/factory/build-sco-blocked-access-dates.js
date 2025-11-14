import { databaseBuffer } from '../database-buffer.js';

const buildScoBlockedAccessDates = function ({
  collegeDate = new Date('2025-11-15'),
  lyceeDate = new Date('2025-10-15'),
} = {}) {
  databaseBuffer.pushInsertable({
    tableName: 'sco_blocked_access_dates',
    values: {
      scoOrganizationType: 'college',
      reopeningDate: collegeDate,
    },
  });
  databaseBuffer.pushInsertable({
    tableName: 'sco_blocked_access_dates',
    values: {
      scoOrganizationType: 'lycee',
      reopeningDate: lyceeDate,
    },
  });

  return {
    collegeDate,
    lyceeDate,
  };
};

export { buildScoBlockedAccessDates };
