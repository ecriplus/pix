import { JuryCertificationSummary } from '../../../../src/certification/session-management/domain/read-models/JuryCertificationSummary.js';
import { AssessmentResult } from '../../../../src/shared/domain/models/AssessmentResult.js';

const buildJuryCertificationSummary = function ({
  id = 123,
  firstName = 'Jean',
  lastName = 'Bon',
  status = AssessmentResult.status.VALIDATED,
  pixScore = 100,
  reachedMeshIndex = 1,
  createdAt = new Date('2020-01-01'),
  completedAt = new Date('2020-01-02'),
  abortReason = null,
  isPublished = true,
  isEndedByInvigilator = false,
  complementaryCertificationLabelObtained,
  complementaryCertificationKeyObtained,
  certificationIssueReports = [],
  candidateSubscription = null,
} = {}) {
  return new JuryCertificationSummary({
    id,
    firstName,
    lastName,
    status,
    pixScore,
    reachedMeshIndex,
    createdAt,
    completedAt,
    abortReason,
    isPublished,
    isEndedByInvigilator,
    complementaryCertificationLabelObtained,
    complementaryCertificationKeyObtained,
    certificationIssueReports,
    candidateSubscription,
  });
};

export { buildJuryCertificationSummary };
