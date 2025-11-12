import { ScoBlockedAccessDates } from '../../../../../../src/certification/configuration/domain/read-models/ScoBlockedAccessDates.js';

export const buildScoBlockedAccessDates = function () {
  return new ScoBlockedAccessDates({
    scoBlockedAccessDatesLycee: new Date('2025-10-15'),
    scoBlockedAccessDatesCollege: new Date('2025-11-15'),
  });
};
