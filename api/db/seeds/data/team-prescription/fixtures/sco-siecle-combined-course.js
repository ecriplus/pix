import { faker } from '@faker-js/faker';

import { CampaignParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { OrganizationLearnerParticipationStatuses } from '../../../../../src/quest/domain/models/OrganizationLearnerParticipation.js';
import { SCO_MANAGING_ORGANIZATION_ID } from '../../common/constants.js';
import { CAMPAIGN_SCO_COMBINED_COURSE_ID } from '../constants.js';

export const SCO_SIECLE_COMBINED_COURSE = {
  organizationId: SCO_MANAGING_ORGANIZATION_ID,
  quest: {
    code: 'SCOMBINIX',
    name: 'Parcours combine sco SIECLE',
    combinedCourseContents: [
      {
        campaignId: CAMPAIGN_SCO_COMBINED_COURSE_ID,
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
      id: CAMPAIGN_SCO_COMBINED_COURSE_ID,
      name: 'Je teste mes compétences',
      code: 'SCOCAMPIX',
      customResultPageButtonText: 'Continuer',
      customResultPageButtonUrl: '/parcours/SCOMBINIX/chargement',
      skills: [],
    },
  },
  participations: [
    {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.exampleEmail(),
      division: '6ème',
      group: null,
      status: OrganizationLearnerParticipationStatuses.STARTED,
      campaignStatus: CampaignParticipationStatuses.SHARED,
    },
    {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.exampleEmail(),
      division: '6ème',
      group: null,
      status: OrganizationLearnerParticipationStatuses.STARTED,
      campaignStatus: CampaignParticipationStatuses.SHARED,
    },
    {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.exampleEmail(),
      division: '5ème',
      group: null,
      status: OrganizationLearnerParticipationStatuses.STARTED,
      campaignStatus: CampaignParticipationStatuses.SHARED,
    },
  ],
};
