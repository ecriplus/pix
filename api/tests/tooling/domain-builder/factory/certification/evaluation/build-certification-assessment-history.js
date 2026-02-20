import { CertificationAssessmentHistory } from '../../../../../../src/certification/evaluation/domain/models/CertificationAssessmentHistory.js';

export const buildCertificationAssessmentHistory = ({ capacityHistory }) => {
  return new CertificationAssessmentHistory({
    capacityHistory,
  });
};
