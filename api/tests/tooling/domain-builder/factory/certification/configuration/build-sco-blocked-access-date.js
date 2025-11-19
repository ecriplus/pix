import { ScoBlockedAccessDate } from '../../../../../../src/certification/configuration/domain/models/ScoBlockedAccessDate.js';

export const buildScoBlockedAccessDateCollege = function ({
  scoOrganizationTagName = 'COLLEGE',
  reopeningDate = new Date('2025-11-15'),
} = {}) {
  return new ScoBlockedAccessDate({
    scoOrganizationTagName: scoOrganizationTagName,
    reopeningDate: reopeningDate,
  });
};

export const buildScoBlockedAccessDateLycee = function ({
  scoOrganizationTagName = 'LYCEE',
  reopeningDate = new Date('2025-10-15'),
} = {}) {
  return new ScoBlockedAccessDate({
    scoOrganizationTagName: scoOrganizationTagName,
    reopeningDate: reopeningDate,
  });
};
