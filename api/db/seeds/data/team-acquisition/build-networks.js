import {
  ADMINISTRATION_TEAM_ALPHA_ID,
  ADMINISTRATION_TEAM_SOLO_ID,
  ORGANIZATION_LEARNER_TYPE_PROFESSIONAL_ID,
  ORGANIZATION_LEARNER_TYPE_STUDENT_ID,
} from './constants.js';

function _buildProNetwork(databaseBuilder) {
  const network = databaseBuilder.factory.buildNetwork({ name: 'Réseau Professionnel' });

  const headOrganization = databaseBuilder.factory.buildOrganization({
    name: 'ABC Comptabilité Loire-Atlantique',
    externalId: 'PRO_FOR_NETWORK',
    type: 'PRO',
    provinceCode: '44',
    credit: null,
    createdAt: new Date('2026-09-03'),
    updatedAt: new Date('2026-09-03'),

    administrationTeamId: ADMINISTRATION_TEAM_SOLO_ID,
    organizationLearnerTypeId: ORGANIZATION_LEARNER_TYPE_PROFESSIONAL_ID,
  });

  const structure = databaseBuilder.factory.buildStructure();

  databaseBuilder.factory.buildFactStructure({
    structureId: structure.id,
    networkId: network.id,
    organizationId: headOrganization.id,
  });
}

function _buildScoNetwork(databaseBuilder) {
  const network = databaseBuilder.factory.buildNetwork({ name: 'Réseau Scolaire' });

  const headOrganization = databaseBuilder.factory.buildOrganization({
    name: 'Ministère',
    externalId: 'SCO_FOR_NETWORK',
    type: 'SCO',
    provinceCode: '75',
    credit: null,
    isManagingStudents: true,
    createdAt: new Date('2026-09-03'),
    updatedAt: new Date('2026-09-03'),

    administrationTeamId: ADMINISTRATION_TEAM_ALPHA_ID,
    organizationLearnerTypeId: ORGANIZATION_LEARNER_TYPE_STUDENT_ID,
  });

  const structure = databaseBuilder.factory.buildStructure();

  databaseBuilder.factory.buildFactStructure({
    structureId: structure.id,
    networkId: network.id,
    organizationId: headOrganization.id,
  });
}

export function buildNetworks(databaseBuilder) {
  _buildProNetwork(databaseBuilder);
  _buildScoNetwork(databaseBuilder);
}
