import { ScoBlockedAccessDate } from '../../../../../../src/certification/configuration/domain/read-models/ScoBlockedAccessDate.js';

export const buildScoBlockedAccessDate = function ({ scoOrganizationType, reopeningDate } = {}) {
  return new ScoBlockedAccessDate({
    scoOrganizationType: scoOrganizationType,
    reopeningDate: reopeningDate,
  });
};
