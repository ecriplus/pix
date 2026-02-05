import { NON_OIDC_IDENTITY_PROVIDERS } from '../../../../src/identity-access-management/domain/constants/identity-providers.js';
import { COUNTRY_FRANCE_CODE, REAL_PIX_SUPER_ADMIN_ID } from '../common/constants.js';
import {
  ADMINISTRATION_TEAM_SOLO_ID,
  ORGANIZATION_LEARNER_TYPE_PROFESSIONAL_ID,
} from '../team-acquisition/constants.js';
import { ACCESS_SCO_BAUDELAIRE_EXTERNAL_ID } from './constants.js';

export function buildArchivedOrganizations(databaseBuilder) {
  databaseBuilder.factory.buildOrganization({
    name: 'Organisation archivée',
    archivedAt: new Date('2023-08-04'),
    createdBy: REAL_PIX_SUPER_ADMIN_ID,
    administrationTeamId: ADMINISTRATION_TEAM_SOLO_ID,
    organizationLearnerTypeId: ORGANIZATION_LEARNER_TYPE_PROFESSIONAL_ID,

    countryCode: COUNTRY_FRANCE_CODE,
  });
  databaseBuilder.factory.buildOrganization({
    type: 'SCO',
    name: 'Lycée Joséphine Baker',
    isManagingStudents: true,
    email: 'josephine.baker@example.net',
    externalId: ACCESS_SCO_BAUDELAIRE_EXTERNAL_ID,
    documentationUrl: 'https://pix.fr/',
    provinceCode: '13',
    identityProviderForCampaigns: NON_OIDC_IDENTITY_PROVIDERS.GAR.code,
    createdBy: REAL_PIX_SUPER_ADMIN_ID,
    archivedAt: new Date('2023-08-04'),
    administrationTeamId: ADMINISTRATION_TEAM_SOLO_ID,
    organizationLearnerTypeId: ORGANIZATION_LEARNER_TYPE_PROFESSIONAL_ID,
    countryCode: COUNTRY_FRANCE_CODE,
  });
}
