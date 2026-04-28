import {
  FRAMEWORK_HISTORY_STATUSES,
  FrameworkHistoryEntry,
} from '../../../../../../src/certification/configuration/domain/read-models/FrameworkHistoryEntry.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Domain | ReadModels | FrameworkHistoryEntry', function () {
  describe('#status', function () {
    it('should be DRAFT when there are no dates', function () {
      const entry = new FrameworkHistoryEntry({
        id: 1,
        startDate: null,
        expirationDate: null,
        assessmentDuration: 90,
        maximumAssessmentLength: 32,
      });

      expect(entry.status).to.equal(FRAMEWORK_HISTORY_STATUSES.DRAFT);
    });

    it('should be ACTIVE when there is a start date but no expiration date', function () {
      const entry = new FrameworkHistoryEntry({
        id: 1,
        startDate: new Date('2024-01-01'),
        expirationDate: null,
        assessmentDuration: 90,
        maximumAssessmentLength: 32,
      });

      expect(entry.status).to.equal(FRAMEWORK_HISTORY_STATUSES.ACTIVE);
    });

    it('should be ARCHIVED when there is an expiration date', function () {
      const entry = new FrameworkHistoryEntry({
        id: 1,
        startDate: new Date('2024-01-01'),
        expirationDate: new Date('2025-01-01'),
        assessmentDuration: 90,
        maximumAssessmentLength: 32,
      });

      expect(entry.status).to.equal(FRAMEWORK_HISTORY_STATUSES.ARCHIVED);
    });
  });
});
