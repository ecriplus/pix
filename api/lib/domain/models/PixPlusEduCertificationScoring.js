const ComplementaryCertificationCourseResult = require('./ComplementaryCertificationCourseResult');
const PartnerCertificationScoring = require('./PartnerCertificationScoring');

class PixPlusEduCertificationScoring extends PartnerCertificationScoring {
  constructor({
    complementaryCertificationCourseId,
    certifiableBadgeKey,
    reproducibilityRate,
    hasAcquiredPixCertification,
  } = {}) {
    super({
      complementaryCertificationCourseId,
      partnerKey: certifiableBadgeKey,
      source: ComplementaryCertificationCourseResult.sources.PIX,
    });

    this.reproducibilityRate = reproducibilityRate;
    this.hasAcquiredPixCertification = hasAcquiredPixCertification;
  }

  isAcquired() {
    return this.hasAcquiredPixCertification && this.reproducibilityRate.isEqualOrAbove(70);
  }
}

module.exports = PixPlusEduCertificationScoring;
