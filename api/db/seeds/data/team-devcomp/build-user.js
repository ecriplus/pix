import { acceptPixOrgaTermsOfService } from '../common/tooling/legal-documents.js';
import { DEVCOMP_USER_ID_ADMIN_ORGANIZATION } from './constants.js';

export async function createDevcompUser(databaseBuilder) {
  const user = databaseBuilder.factory.buildUser.withRawPassword({
    id: DEVCOMP_USER_ID_ADMIN_ORGANIZATION,
    firstName: 'Dédé',
    lastName: 'Kong',
    email: 'admin-devcomp@example.net',
    cgu: true,
    lang: 'fr',
  });
  acceptPixOrgaTermsOfService(databaseBuilder, DEVCOMP_USER_ID_ADMIN_ORGANIZATION);

  return user.id;
}
