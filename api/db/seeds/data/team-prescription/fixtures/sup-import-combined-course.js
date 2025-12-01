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
  },
  successRequirements: [
    {
      data: {
        status: { data: 'SHARED', comparison: 'equal' },
        campaignId: { data: CAMPAIGN_SUP_COMBINED_COURSE_ID, comparison: 'equal' },
      },
      comparison: 'all',
      requirement_type: 'campaignParticipations',
    },
    {
      data: {
        moduleId: { data: 'eeeb4951-6f38-4467-a4ba-0c85ed71321a', comparison: 'equal' },
        isTerminated: { data: true, comparison: 'equal' },
      },
      comparison: 'all',
      requirement_type: 'passages',
    },
    {
      data: {
        moduleId: { data: 'f32a2238-4f65-4698-b486-15d51935d335', comparison: 'equal' },
        isTerminated: { data: true, comparison: 'equal' },
      },
      comparison: 'all',
      requirement_type: 'passages',
    },
  ],
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
