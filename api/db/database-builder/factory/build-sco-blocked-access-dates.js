import { databaseBuffer } from '../database-buffer.js';

const buildScoBlockedAccessDates = function ({
  scoBlockedAccessDateCollege = new Date('2025-11-15'),
  scoBlockedAccessDateLycee = new Date('2025-10-15'),
} = {}) {
  databaseBuffer.pushInsertable({
    tableName: 'sco-blocked-access-dates',
    values: {
      id: databaseBuffer.getNextId(),
      key: 'sco-blocked-access-date-college',
      value: scoBlockedAccessDateCollege,
    },
  });
  databaseBuffer.pushInsertable({
    tableName: 'sco-blocked-access-dates',
    values: { id: databaseBuffer.getNextId(), key: 'sco-blocked-access-date-lycee', value: scoBlockedAccessDateLycee },
  });

  return {
    scoBlockedAccessDateCollege,
    scoBlockedAccessDateLycee,
  };
};

export { buildScoBlockedAccessDates };
