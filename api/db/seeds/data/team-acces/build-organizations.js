import { COUNTRY_CANADA_CODE } from '../common/constants.js';
import {
  ADMINISTRATION_TEAM_SOLO_ID,
  ORGANIZATION_LEARNER_TYPE_PROFESSIONAL_ID,
} from '../team-acquisition/constants.js';

export function buildOrganizations(databaseBuilder) {
  _buildOrganizationWithoutAdmins(databaseBuilder);
}

function _buildOrganizationWithoutAdmins(databaseBuilder) {
  const organization = databaseBuilder.factory.buildOrganization({
    type: 'PRO',
    name: 'Accessorama',
    administrationTeamId: ADMINISTRATION_TEAM_SOLO_ID,
    organizationLearnerTypeId: ORGANIZATION_LEARNER_TYPE_PROFESSIONAL_ID,

    countryCode: COUNTRY_CANADA_CODE,
  });

  const tag1 = databaseBuilder.factory.buildTag({ name: 'tag1' });
  const tag2 = databaseBuilder.factory.buildTag({ name: 'tag2' });
  databaseBuilder.factory.buildDataProtectionOfficer.withOrganizationId({
    firstName: 'Claire',
    lastName: 'Voyance',
    email: 'claire.voyance@example.net',
    organizationId: organization.id,
  });
  databaseBuilder.factory.buildOrganizationTag({
    organizationId: organization.id,
    tagId: tag1.id,
  });
  databaseBuilder.factory.buildOrganizationTag({ organizationId: organization.id, tagId: tag2.id });
}
