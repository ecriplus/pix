// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { equal } from '@ember/object/computed';
import Model, { attr, hasMany } from '@ember-data/model';
import dayjs from 'dayjs';
import pick from 'lodash/pick';

export default class Organization extends Model {
  @attr('nullable-string') name;
  @attr('nullable-string') type;
  @attr('nullable-string') logoUrl;
  @attr('nullable-string') externalId;
  @attr('nullable-string') provinceCode;
  @attr('number') credit;
  @attr('nullable-string') email;
  @attr() createdBy;
  @attr('date') createdAt;
  @attr('nullable-string') documentationUrl;
  @attr('nullable-string') archivistFullName;
  @attr('date') archivedAt;
  @attr('nullable-string') creatorFullName;
  @attr() identityProviderForCampaigns;
  @attr() dataProtectionOfficerFirstName;
  @attr() dataProtectionOfficerLastName;
  @attr() dataProtectionOfficerEmail;
  @attr() features;
  @attr('nullable-string') code;
  @attr() parentOrganizationId;
  @attr('nullable-string') parentOrganizationName;
  //TODO REMOVE nullable-string BEFORE THE END OF EPIX
  @attr('nullable-string') administrationTeamId;
  @attr('nullable-string') administrationTeamName;
  @equal('type', 'SCO') isOrganizationSCO;
  @equal('type', 'SUP') isOrganizationSUP;

  @hasMany('organization-membership', { async: true, inverse: 'organization' }) organizationMemberships;
  @hasMany('target-profile-summary', { async: true, inverse: null }) targetProfileSummaries;
  @hasMany('tag', { async: true, inverse: null }) tags;
  @hasMany('organization', { async: true, inverse: null }) children;

  static get featureList() {
    return {
      MULTIPLE_SENDING_ASSESSMENT: 'MULTIPLE_SENDING_ASSESSMENT',
      PLACES_MANAGEMENT: 'PLACES_MANAGEMENT',
      COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY: 'COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY',
      LEARNER_IMPORT: 'LEARNER_IMPORT',
      IS_MANAGING_STUDENTS: 'IS_MANAGING_STUDENTS',
      SHOW_NPS: 'SHOW_NPS',
      SHOW_SKILLS: 'SHOW_SKILLS',
      ATTESTATIONS_MANAGEMENT: 'ATTESTATIONS_MANAGEMENT',
    };
  }

  static get editableFeatureList() {
    return pick(
      Organization.featureList,
      'MULTIPLE_SENDING_ASSESSMENT',
      'IS_MANAGING_STUDENTS',
      'SHOW_SKILLS',
      'PLACES_MANAGEMENT',
    );
  }

  get isLearnerImportEnabled() {
    return this.features[Organization.featureList.LEARNER_IMPORT].active;
  }

  async hasMember(userId) {
    const memberships = await this.organizationMemberships;
    return memberships.some((membership) => membership.user?.id === userId);
  }

  get archivedFormattedDate() {
    return dayjs(this.archivedAt).format('DD/MM/YYYY');
  }

  get createdAtFormattedDate() {
    return dayjs(this.createdAt).format('DD/MM/YYYY');
  }

  get isArchived() {
    return !!this.archivedAt;
  }

  get dataProtectionOfficerFullName() {
    const fullName = [];

    if (this.dataProtectionOfficerFirstName) fullName.push(this.dataProtectionOfficerFirstName);
    if (this.dataProtectionOfficerLastName) fullName.push(this.dataProtectionOfficerLastName);

    return fullName.join(' ');
  }
}
