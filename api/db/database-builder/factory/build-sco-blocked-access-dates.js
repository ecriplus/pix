import { ScoOrganizationTagName } from '../../../src/certification/configuration/domain/models/ScoOrganizationTagName.js';
import { databaseBuffer } from '../database-buffer.js';

export function buildScoBlockedAccessDate({ reopeningDate = new Date('2025-11-15'), scoOrganizationTagName }) {
  databaseBuffer.pushInsertable({
    tableName: 'certification_sco_blocked_access_dates',
    values: {
      scoOrganizationTagName,
      reopeningDate,
    },
  });
}

export function buildScoBlockedAccessDates({
  collegeDate = new Date('2025-11-15'),
  lyceeDate = new Date('2025-10-15'),
} = {}) {
  buildScoBlockedAccessDate({ reopeningDate: collegeDate, scoOrganizationTagName: ScoOrganizationTagName.COLLEGE });
  buildScoBlockedAccessDate({ reopeningDate: lyceeDate, scoOrganizationTagName: ScoOrganizationTagName.LYCEE });
  return {
    collegeDate,
    lyceeDate,
  };
}
