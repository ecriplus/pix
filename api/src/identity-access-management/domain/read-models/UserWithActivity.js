import { STATUS } from '../../../legal-documents/domain/models/LegalDocumentStatus.js';

class UserWithActivity {
  constructor({
    user,
    tosStatus,
    hasAssessmentParticipations,
    codeForLastProfileToShare,
    hasRecommendedTrainings,
    shouldSeeDataProtectionPolicyInformationBanner,
  }) {
    Object.assign(this, user);
    this.hasAssessmentParticipations = hasAssessmentParticipations;
    this.codeForLastProfileToShare = codeForLastProfileToShare;
    this.hasRecommendedTrainings = hasRecommendedTrainings;
    this.shouldSeeDataProtectionPolicyInformationBanner = shouldSeeDataProtectionPolicyInformationBanner;
    //legacy tos
    this.cgu = tosStatus.status === STATUS.ACCEPTED || tosStatus.status === STATUS.UPDATE_REQUESTED;
    this.mustValidateTermsOfService =
      tosStatus.status === STATUS.REQUESTED || tosStatus.status === STATUS.UPDATE_REQUESTED;
    this.lastTermsOfServiceValidatedAt = tosStatus.acceptedAt;
    //new tos
    this.pixAppTermsOfServiceStatus = tosStatus.status;
    this.pixAppTermsOfServiceDocumentPath = tosStatus.documentPath;
  }
}

export { UserWithActivity };
