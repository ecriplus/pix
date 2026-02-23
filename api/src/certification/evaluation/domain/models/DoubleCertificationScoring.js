import { ChallengesReferential } from '../../../shared/domain/models/ChallengesReferential.js';
import { PartnerCertificationScoring } from './PartnerCertificationScoring.js';

export class DoubleCertificationScoring extends PartnerCertificationScoring {
  constructor({
    complementaryCertificationCourseId,
    complementaryCertificationBadgeId,
    pixScore,
    minimumEarnedPix,
    hasAcquiredPixCertification,
    isRejectedForFraud,
  } = {}) {
    super({
      complementaryCertificationCourseId,
      complementaryCertificationBadgeId,
      isRejectedForFraud,
      hasAcquiredPixCertification,
      source: ChallengesReferential.PIX,
    });
    this.pixScore = pixScore;
    this.minimumEarnedPix = minimumEarnedPix;
  }

  isAcquired() {
    return !this.isRejectedForFraud && this.hasAcquiredPixCertification && this._isAboveMinimumScore();
  }

  _isAboveMinimumScore() {
    return this.pixScore >= this.minimumEarnedPix;
  }
}
