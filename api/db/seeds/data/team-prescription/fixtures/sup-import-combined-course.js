import { faker } from '@faker-js/faker';

import { CampaignParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { OrganizationLearnerParticipationStatuses } from '../../../../../src/quest/domain/models/OrganizationLearnerParticipation.js';
import { SUP_MANAGING_ORGANIZATION_ID } from '../../common/constants.js';
import { CAMPAIGN_SUP_COMBINED_COURSE_ID } from '../constants.js';
export const SUP_IMPORT_COMBINED_COURSE = {
  organizationId: SUP_MANAGING_ORGANIZATION_ID,
  quest: {
    code: 'SUPINIX',
    name: 'Parcours combine SUP import',
    combinedCourseContents: [
      {
        campaignId: CAMPAIGN_SUP_COMBINED_COURSE_ID,
      },
      {
        moduleId: 'eeeb4951-6f38-4467-a4ba-0c85ed71321a',
      },
      {
        moduleId: 'f32a2238-4f65-4698-b486-15d51935d335',
      },
    ],
  },
  targetProfile: {
    description: 'Description',
    name: 'Parcours',
    tubes: [
      {
        id: 'tube2e715GxaaWzNK6',
        level: 2,
      },
    ],
    campaign: {
      id: CAMPAIGN_SUP_COMBINED_COURSE_ID,
      name: 'Je teste mes compétences',
      code: 'SUPCAMPIX',
      customResultPageButtonText: 'Continuer',
      customResultPageButtonUrl: '/parcours/SUPINIX/chargement',
      skills: [],
    },
  },
  participations: [
    {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.exampleEmail(),
      division: null,
      group: 'Groupe A',
      status: OrganizationLearnerParticipationStatuses.STARTED,
      campaignStatus: CampaignParticipationStatuses.SHARED,
    },
    {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.exampleEmail(),
      division: null,
      group: 'Groupe A',
      status: OrganizationLearnerParticipationStatuses.STARTED,
      campaignStatus: CampaignParticipationStatuses.SHARED,
    },
    {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.exampleEmail(),
      division: null,
      group: 'Groupe B',
      status: OrganizationLearnerParticipationStatuses.STARTED,
      campaignStatus: CampaignParticipationStatuses.SHARED,
    },
  ],
};
