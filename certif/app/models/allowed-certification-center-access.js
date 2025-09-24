import Model, { attr } from '@ember-data/model';

const CERTIFICATION_CENTER_TYPES = {
  SUP: 'SUP',
  SCO: 'SCO',
  PRO: 'PRO',
};

export default class AllowedCertificationCenterAccess extends Model {
  @attr() name;
  @attr() externalId;
  @attr() type;
  @attr() isRelatedToManagingStudentsOrganization;
  @attr() isAccessBlockedCollege;
  @attr() isAccessBlockedLycee;
  @attr() isAccessBlockedAEFE;
  @attr() isAccessBlockedAgri;
  @attr() isAccessBlockedUntilDate;
  @attr() relatedOrganizationTags;
  @attr() habilitations;
  @attr() pixCertifBlockedAccessUntilDate;
  @attr() pixCertifScoBlockedAccessDateLycee;
  @attr() pixCertifScoBlockedAccessDateCollege;

  get isSco() {
    return this.type === CERTIFICATION_CENTER_TYPES.SCO;
  }

  get isPro() {
    return this.type === CERTIFICATION_CENTER_TYPES.PRO;
  }

  get isSup() {
    return this.type === CERTIFICATION_CENTER_TYPES.SUP;
  }

  get isScoManagingStudents() {
    return this.type === CERTIFICATION_CENTER_TYPES.SCO && this.isRelatedToManagingStudentsOrganization;
  }

  get isAccessRestricted() {
    return (
      this.isAccessBlockedUntilDate ||
      this.isAccessBlockedCollege ||
      this.isAccessBlockedLycee ||
      this.isAccessBlockedAEFE ||
      this.isAccessBlockedAgri
    );
  }

  get hasHabilitations() {
    return this.habilitations.length > 0;
  }
}
