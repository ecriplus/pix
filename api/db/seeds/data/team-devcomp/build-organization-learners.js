import { TEAM_DEVCOMP_ORGANIZATION_ID } from './constants.js';

export async function createDevcompOrganizationLearners(databaseBuilder) {
  const firstUser = databaseBuilder.factory.buildUser.withRawPassword({
    firstName: 'Dave',
    lastName: 'Comp',
    email: 'dave-comp@example.net',
    username: 'dave.comp',
  });

  const firstUserDetails = {
    birthdate: '2012-01-01',
    nationalStudentId: '0123456789DC',
    user: firstUser,
  };

  const secondUser = databaseBuilder.factory.buildUser.withRawPassword({
    firstName: 'Kat',
    lastName: 'Alloguicks',
    email: 'kat-alloguicks@example.net',
    username: 'kat.alloguicks',
  });

  const secondUserDetails = {
    birthdate: '2012-02-02',
    nationalStudentId: '0123456789JA',
    user: secondUser,
  };

  const thirdUser = databaseBuilder.factory.buildUser.withRawPassword({
    firstName: 'Maude',
    lastName: 'Hulix',
    email: 'maude-hulix@example.net',
    username: 'maude.hulix',
  });

  const thirdUserDetails = {
    birthdate: '2012-03-03',
    nationalStudentId: '0123456789MH',
    user: thirdUser,
  };

  const userDetails = [firstUserDetails, secondUserDetails, thirdUserDetails];

  userDetails.forEach((userDetails) => _buildOrganizationLearners({ ...userDetails, databaseBuilder }));

  return userDetails.length;
}

function _buildOrganizationLearners({ birthdate, databaseBuilder, nationalStudentId, user }) {
  const { id: userId, firstName, lastName } = user;
  databaseBuilder.factory.buildOrganizationLearner({
    firstName,
    lastName,
    birthdate,
    division: '6E',
    group: null,
    organizationId: TEAM_DEVCOMP_ORGANIZATION_ID,
    userId,
    nationalStudentId,
  });
}
