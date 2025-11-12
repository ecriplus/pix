import { databaseBuffer } from '../database-buffer.js';

const buildScoBlockedAccessDates = function ({
  scoBlockedAccessDateCollege = '2025-11-15',
  scoBlockedAccessDateLycee = '2025-10-15',
} = {}) {
  databaseBuffer.pushInsertable({
    tableName: 'sco-blocked-access-dates',
    values: { id: databaseBuffer.getNextId(), key: 'scoBlockedAccessDateCollege', value: scoBlockedAccessDateCollege },
  });
  databaseBuffer.pushInsertable({
    tableName: 'sco-blocked-access-dates',
    values: { id: databaseBuffer.getNextId(), key: 'scoBlockedAccessDateLycee', value: scoBlockedAccessDateLycee },
  });

  return {
    scoBlockedAccessDateCollege,
    scoBlockedAccessDateLycee,
  };
};

export { buildScoBlockedAccessDates };
