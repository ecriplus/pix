import { acceptPixOrgaTermsOfService } from '../common/tooling/legal-documents.js';

export const PIX_ORGA_ALL_ORGA_ID = 10001;
export const PIX_ORGA_ADMIN_LEAVING_ID = 10002;
export const PIX_ORGA_CGU_UPDATED_ID = 10003;

export function buildOrganizationUsers(databaseBuilder) {
  [
    {
      id: PIX_ORGA_ALL_ORGA_ID,
      firstName: 'Rhaenyra',
      lastName: 'Targaryen',
      email: 'allorga@example.net',
      cguVersion: 'v2',
    },
    {
      id: PIX_ORGA_ADMIN_LEAVING_ID,
      firstName: 'Admin',
      lastName: 'Leaving',
      email: 'admin.leaving@example.net',
    },
    {
      id: PIX_ORGA_CGU_UPDATED_ID,
      firstName: 'John',
      lastName: 'With CGU updated',
      email: 'cgu.updated@example.net',
      cguVersion: 'v1',
    },
  ].forEach(_buildUser(databaseBuilder));
}

function _buildUser(databaseBuilder) {
  return function ({ id, firstName, lastName, email, cguVersion }) {
    databaseBuilder.factory.buildUser.withRawPassword({
      id,
      firstName,
      lastName,
      email,
      cgu: true,
    });

    if (cguVersion) {
      acceptPixOrgaTermsOfService(databaseBuilder, id, cguVersion);
    }
  };
}
