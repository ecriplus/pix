import { ScoBlockedAccessDate } from '../../../../../../src/certification/configuration/domain/models/ScoBlockedAccessDate.js';
import { ScoOrganizationTagName } from '../../../../../../src/certification/configuration/domain/models/ScoOrganizationTagName.js';

export const buildScoBlockedAccessDateCollege = function ({
  scoOrganizationTagName = ScoOrganizationTagName.COLLEGE,
  reopeningDate = new Date('2025-11-15'),
} = {}) {
  return new ScoBlockedAccessDate({
    scoOrganizationTagName: scoOrganizationTagName,
    reopeningDate: reopeningDate,
  });
};

export const buildScoBlockedAccessDateLycee = function ({
  scoOrganizationTagName = ScoOrganizationTagName.LYCEE,
  reopeningDate = new Date('2025-10-15'),
} = {}) {
  return new ScoBlockedAccessDate({
    scoOrganizationTagName: scoOrganizationTagName,
    reopeningDate: reopeningDate,
  });
};
