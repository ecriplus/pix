import { databaseBuffer } from '../database-buffer.js';

const buildScoBlockedAccessDates = function ({
  collegeDate = new Date('2025-11-15'),
  lyceeDate = new Date('2025-10-15'),
} = {}) {
  databaseBuffer.pushInsertable({
    tableName: 'sco-blocked-access-dates',
    values: {
      id: databaseBuffer.getNextId(),
      scoOrganizationType: 'college',
      reopeningDate: collegeDate,
    },
  });
  databaseBuffer.pushInsertable({
    tableName: 'sco-blocked-access-dates',
    values: {
      id: databaseBuffer.getNextId(),
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
