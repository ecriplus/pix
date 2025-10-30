import { faker } from '@faker-js/faker';

import { CampaignParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { OrganizationLearnerParticipationStatuses } from '../../../../../src/quest/domain/models/OrganizationLearnerParticipation.js';
import { PRO_ORGANIZATION_ID } from '../../common/constants.js';
import { CAMPAIGN_PRO_COMBINED_COURSE_ID } from '../constants.js';

export const PRO_COMBINED_COURSE = {
  organizationId: PRO_ORGANIZATION_ID,
  quest: {
    code: 'COMBINIX1',
    name: 'Parcours combine complet',
    eligibilityRequirements: [],
    successRequirements: [
      {
        requirement_type: 'campaignParticipations',
        comparison: 'all',
        data: {
          campaignId: {
            data: CAMPAIGN_PRO_COMBINED_COURSE_ID,
            comparison: 'equal',
          },
          status: {
            data: 'SHARED',
            comparison: 'equal',
          },
        },
      },
      {
        requirement_type: 'passages',
        comparison: 'all',
        data: {
          moduleId: {
            data: 'eeeb4951-6f38-4467-a4ba-0c85ed71321a',
            comparison: 'equal',
          },
          isTerminated: {
            data: true,
            comparison: 'equal',
          },
        },
      },
      {
        requirement_type: 'passages',
        comparison: 'all',
        data: {
          moduleId: {
            data: 'f32a2238-4f65-4698-b486-15d51935d335',
            comparison: 'equal',
          },
          isTerminated: {
            data: true,
            comparison: 'equal',
          },
        },
      },
      {
        requirement_type: 'passages',
        comparison: 'all',
        data: {
          moduleId: {
            data: 'ab82925d-4775-4bca-b513-4c3009ec5886',
            comparison: 'equal',
          },
          isTerminated: {
            data: true,
            comparison: 'equal',
          },
        },
      },
    ],
  },
  targetProfile: {
    description: 'Description parcours combinix 1',
    name: 'Parcours combinix 1',
    stages: [
      { title: 'Stage 1', threshold: 10 },
      { title: 'Stage 2', threshold: 20 },
      { title: 'Stage 3', threshold: 30 },
      { title: 'Stage 4', threshold: 40 },
    ],
    tubes: [
      {
        id: 'tube2e715GxaaWzNK6',
        level: 2,
      },
      {
        id: 'recs1vdbHxX8X55G9',
        level: 2,
      },
      {
        id: 'recBbCIEKgrQi7eb6',
        level: 2,
      },
      {
        id: 'recpe7Y8Wq2D56q6I',
        level: 2,
      },
    ],
    campaign: {
      id: CAMPAIGN_PRO_COMBINED_COURSE_ID,
      name: 'Je teste mes compétences',
      code: 'CODE123',
      customResultPageButtonText: 'Continuer',
      customResultPageButtonUrl: '/parcours/COMBINIX1/chargement',
      skills: ['reczOCGv8pz976Acl', 'skill1QAVccgLO16Rx8', 'skill2wQfMYrOHlL6HI', 'skillX5Rpk2rucNfnF'],
    },
    trainings: [
      {
        title: 'Demo combinix 1',
        link: '/modules/demo-combinix-1',
        locale: 'fr',
        threshold: 50,
      },
      {
        title: 'Demo combinix 2',
        link: '/modules/demo-combinix-2',
        locale: 'fr',
        threshold: 90,
      },
    ],
  },
  participations: [
    {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: 'combined@pix.fr',
      status: OrganizationLearnerParticipationStatuses.STARTED,
      campaignStatus: CampaignParticipationStatuses.SHARED,
    },
  ],
};
