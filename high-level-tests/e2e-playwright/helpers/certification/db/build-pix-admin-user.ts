import { Knex } from 'knex';

import { createUserInDB } from '../../db-utils.ts';

export async function buildPixAdminUser(knex: Knex, userData: any) {
  const admiUserId = await createUserInDB(
    {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      rawPassword: userData.rawPassword,
      cgu: true,
      pixCertifTermsOfServiceAccepted: true,
      mustValidateTermsOfService: false,
      id: userData.id,
    },
    knex,
  );
  await knex('pix-admin-roles').insert({ userId: admiUserId, role: userData.role });
}
