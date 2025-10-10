import { ADMINISTRATION_TEAM_SOLO_ID } from '../common/constants.js';

export function buildOrganizations(databaseBuilder) {
  _buildOrganizationWithoutAdmins(databaseBuilder);
}

function _buildOrganizationWithoutAdmins(databaseBuilder) {
  const organization = databaseBuilder.factory.buildOrganization({
    type: 'PRO',
    name: 'Accis',
    administrationTeamId: ADMINISTRATION_TEAM_SOLO_ID,
  });

  const tag1 = databaseBuilder.factory.buildTag({ name: 'tag1' });
  const tag2 = databaseBuilder.factory.buildTag({ name: 'tag2' });
  databaseBuilder.factory.buildDataProtectionOfficer.withOrganizationId({
    firstName: 'justin',
    lastName: 'instant',
    email: 'justin-instant@example.net',
    organizationId: organization.id,
  });
  databaseBuilder.factory.buildOrganizationTag({
    organizationId: organization.id,
    tagId: tag1.id,
  });
  databaseBuilder.factory.buildOrganizationTag({ organizationId: organization.id, tagId: tag2.id });
}
