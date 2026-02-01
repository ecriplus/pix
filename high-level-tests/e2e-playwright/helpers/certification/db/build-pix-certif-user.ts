import { Knex } from 'knex';

import {
  createCertificationCenterHabilitationInDB,
  createCertificationCenterInDB,
  createCertificationCenterMembershipInDB,
  createUserInDB,
} from '../../db-utils.ts';

export async function buildPixCertifUser(knex: Knex, userData: any) {
  const certificationUserId = await createUserInDB(
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
  for (const certificationCenter of userData.certificationCenters) {
    const certificationCenterId = await createCertificationCenterInDB(
      {
        type: certificationCenter.type,
        externalId: certificationCenter.externalId,
      },
      knex,
    );
    await createCertificationCenterMembershipInDB({ userId: certificationUserId, certificationCenterId }, knex);
    for (const habilitationKey of certificationCenter.habilitations) {
      await createCertificationCenterHabilitationInDB({ certificationCenterId, key: habilitationKey }, knex);
    }
  }
}
