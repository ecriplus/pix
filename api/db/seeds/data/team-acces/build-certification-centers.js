import { createCertificationCenter } from '../common/tooling/certification-center-tooling.js';

const CERTIFICATION_CENTER_OFFSET_ID = 8000;

export async function buildCertificationCenters(databaseBuilder) {
  const [
    userWithAdminRole1,
    userWithAdminRole2,
    userWithMemberRole1,
    userWithMemberRole2,
    userWithMemberRole3,
    userWithInvitation,
    secondUserWithInvitation,
  ] = [
    {
      firstName: 'Cerberus',
      lastName: 'Accès',
      email: 'certacces@example.net',
      username: 'certacces',
    },
    {
      firstName: 'Otto',
      lastName: 'Graf',
      email: 'otto.graf@example.net',
      username: 'otto.graf',
    },
    {
      firstName: 'Édith',
      lastName: 'Orial',
      email: 'edith.orial@example.net',
      username: 'edith.orial',
    },
    {
      firstName: 'Renée',
      lastName: 'Sens',
      email: 'renee-sens@example.net',
      username: 'renee.sens',
    },
    {
      firstName: 'Harry',
      lastName: 'Cover',
      email: 'harry-cover@example.net',
      username: 'harry.cover',
    },
    {
      firstName: 'Vivien',
      lastName: 'Chezmoi',
      email: 'vivien.chezmoi@example.net',
      username: 'vivien.chezmoi',
    },
    {
      firstName: 'Agathe',
      lastName: 'Zeublouse',
      email: 'agathe-zeublouse@example.net',
      username: 'agathe.zeublouse',
    },
  ].map((user) => _buildUsersWithDefaultPassword({ databaseBuilder, ...user }));

  const { certificationCenterId } = await createCertificationCenter({
    name: 'Accessorium',
    certificationCenterId: CERTIFICATION_CENTER_OFFSET_ID,
    databaseBuilder,
    members: [
      { id: userWithAdminRole1.id, role: 'ADMIN' },
      { id: userWithAdminRole2.id, role: 'ADMIN' },
      { id: userWithMemberRole1.id },
      { id: userWithMemberRole2.id },
      { id: userWithMemberRole3.id },
    ],
    externalId: 'TEAM_ACCES_123',
  });

  await createCertificationCenter({
    name: 'Accessovolt',
    certificationCenterId: CERTIFICATION_CENTER_OFFSET_ID + 1,
    databaseBuilder,
    members: [{ id: userWithAdminRole1.id }],
    externalId: 'TEAM_ACCES_456',
  });

  await createCertificationCenter({
    name: 'Accestral',
    certificationCenterId: CERTIFICATION_CENTER_OFFSET_ID + 2,
    databaseBuilder,
    members: [{ id: userWithAdminRole1.id, role: 'ADMIN' }],
    externalId: 'TEAM_ACCES_789',
  });

  _buildCertificationCenterInvitations({
    databaseBuilder,
    users: [userWithInvitation, secondUserWithInvitation],
    certificationCenterId,
  });
}

function _buildUsersWithDefaultPassword({ databaseBuilder, firstName, lastName, email, username }) {
  return databaseBuilder.factory.buildUser.withRawPassword({
    firstName,
    lastName,
    email,
    username,
    cgu: true,
    lastPixCertifTermsOfServiceValidatedAt: new Date(),
    pixCertifTermsOfServiceAccepted: true,
  });
}

function _buildCertificationCenterInvitations({ databaseBuilder, users, certificationCenterId }) {
  users.forEach(({ id: userId, email }) => {
    databaseBuilder.factory.buildCertificationCenterInvitation({
      userId,
      certificationCenterId,
      email,
    });
  });
}
