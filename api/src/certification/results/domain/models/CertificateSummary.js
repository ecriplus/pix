import { AssessmentResult } from '../../../../shared/domain/models/AssessmentResult.js';
import { JuryComment, JuryCommentContexts } from '../../../shared/domain/models/JuryComment.js';

export const CERTIFICATE_STATUSES = {
  WAITING_FOR_RESULTS: 'WAITING_FOR_RESULTS',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  VALIDATED: 'VALIDATED',
};

export const EXTRA_CERTIFICATE_STATUSES = {
  WAITING_FOR_RESULTS: 'WAITING_FOR_RESULTS',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
  ACQUIRED: 'ACQUIRED',
  NOT_ACQUIRED: 'NOT_ACQUIRED',
};

export class CertificateSummary {
  constructor({
    id,
    verificationCode,
    certificationStartedAt,
    certificationFramework,
    certificationCenterName,
    pixScore,
    juryComment,
    status,
    extraCertificationStatus,
  }) {
    this.id = id;
    this.verificationCode = verificationCode;
    this.certificationStartedAt = certificationStartedAt;
    this.certificationFramework = certificationFramework;
    this.certificationCenterName = certificationCenterName;
    this.pixScore = pixScore;
    this.juryComment = juryComment;
    this.status = status;
    this.extraCertificationStatus = extraCertificationStatus;
  }

  static buildFrom({
    id,
    verificationCode,
    certificationStartedAt,
    certificationFramework,
    certificationCenterName,
    pixScore,
    commentForCandidate,
    commentByAutoJury,
    assessmentResultStatus,
    isPublished,
    isExtraCertificationAcquired,
  }) {
    let status, extraCertificationStatus;
    const mappingAssessmentResultStatuses = {
      [AssessmentResult.status.CANCELLED]: CERTIFICATE_STATUSES.CANCELLED,
      [AssessmentResult.status.VALIDATED]: CERTIFICATE_STATUSES.VALIDATED,
      [AssessmentResult.status.REJECTED]: CERTIFICATE_STATUSES.REJECTED,
    };
    const mappingExtraCertificationStatus = {
      [true]: EXTRA_CERTIFICATE_STATUSES.ACQUIRED,
      [false]: EXTRA_CERTIFICATE_STATUSES.NOT_ACQUIRED,
      [null]: EXTRA_CERTIFICATE_STATUSES.NOT_APPLICABLE,
    };
    if (!isPublished) {
      status = CERTIFICATE_STATUSES.WAITING_FOR_RESULTS;
      extraCertificationStatus = EXTRA_CERTIFICATE_STATUSES.WAITING_FOR_RESULTS;
    } else {
      status = mappingAssessmentResultStatuses[assessmentResultStatus];
      extraCertificationStatus = mappingExtraCertificationStatus[isExtraCertificationAcquired];
    }
    const juryComment = new JuryComment({
      commentByAutoJury,
      fallbackComment: commentForCandidate,
      context: JuryCommentContexts.CANDIDATE,
    });

    return new CertificateSummary({
      id,
      verificationCode,
      certificationStartedAt,
      certificationFramework,
      certificationCenterName,
      pixScore,
      juryComment: juryComment,
      status,
      extraCertificationStatus,
    });
  }
}
