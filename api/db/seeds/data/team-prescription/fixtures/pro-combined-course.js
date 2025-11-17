import { faker } from '@faker-js/faker';

import { CampaignParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { OrganizationLearnerParticipationStatuses } from '../../../../../src/quest/domain/models/OrganizationLearnerParticipation.js';
import { PRO_ORGANIZATION_ID } from '../../common/constants.js';
import { CAMPAIGN_PRO_COMBINED_COURSE_ID } from '../constants.js';

export const PRO_COMBINED_COURSE = {
  organizationId: PRO_ORGANIZATION_ID,
  quest: {
    code: 'COMBINIX1',
    name: 'Parcours apprenant complet',
    eligibilityRequirements: [],
    successRequirements: [
      {
        data: {
          status: { data: 'SHARED', comparison: 'equal' },
          campaignId: { data: CAMPAIGN_PRO_COMBINED_COURSE_ID, comparison: 'equal' },
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
  },
  targetProfile: {
    description: 'Description parcours combinix 1',
    name: 'Parcours combinix 1',
    stages: [
      { title: 'Stage 1', threshold: 20 },
      { title: 'Stage 2', threshold: 40 },
      { title: 'Stage 3', threshold: 60 },
      { title: 'Stage 4', threshold: 80 },
    ],
    tubes: [
      { id: 'recrkpItPsNRg2OjJ', level: 2 },
      { id: 'recpQLhHdOTQAx6UL', level: 2 },
      { id: 'recMPzW9BRjRdOisX', level: 2 },
      { id: 'recVpgUtxW3xx5Pu', level: 2 },
    ],
    campaign: {
      id: CAMPAIGN_PRO_COMBINED_COURSE_ID,
      name: 'Je teste mes compétences',
      code: 'CODE123',
      customResultPageButtonText: 'Continuer',
      customResultPageButtonUrl: '/parcours/COMBINIX1/chargement',
      skills: ['rec0J9OXaAj5v7w3r', 'rec1BJ9Z7bZRX2zkY', 'rec1EM9oLKC6itxs0', 'rec1kFnt3fpPE6Ixe'],
    },
    trainings: [
      {
        title: 'Demo combinix 1',
        link: '/modules/demo-combinix-1',
        type: 'modulix',
        duration: '0 years 0 mons 0 days 0 hours 1 mins 0.0 secs',
        locale: 'fr',
        editorName: 'Pix',
        editorLogoUrl: 'https://assets.pix.org/modules/placeholder-details.svg',
        isDisabled: 'false',
        internalTitle: 'Demo combinix 1 (internal)',
        threshold: 0,
      },
      {
        title: 'Demo combinix 2',
        link: '/modules/demo-combinix-2',
        type: 'modulix',
        duration: '0 years 0 mons 0 days 0 hours 1 mins 0.0 secs',
        locale: 'fr',
        editorName: 'Pix',
        editorLogoUrl: 'https://assets.pix.org/modules/placeholder-details.svg',
        isDisabled: 'false',
        internalTitle: 'Demo combinix 2 (internal)',
        threshold: 20,
      },
      {
        title: 'Demo combinix 1',
        link: '/modules/demo-combinix-1',
        type: 'modulix',
        duration: '0 years 0 mons 0 days 0 hours 1 mins 0.0 secs',
        locale: 'fr-fr',
        editorName: 'Pix',
        editorLogoUrl: 'https://assets.pix.org/modules/placeholder-details.svg',
        isDisabled: 'false',
        internalTitle: 'Demo combinix 1 (internal)',
        threshold: 0,
      },
      {
        title: 'Demo combinix 2',
        link: '/modules/demo-combinix-2',
        type: 'modulix',
        duration: '0 years 0 mons 0 days 0 hours 1 mins 0.0 secs',
        locale: 'fr-fr',
        editorName: 'Pix',
        editorLogoUrl: 'https://assets.pix.org/modules/placeholder-details.svg',
        isDisabled: 'false',
        internalTitle: 'Demo combinix 2 (internal)',
        threshold: 20,
      },
    ],
  },
  participations: [
    {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: 'combined@example.net',
      status: OrganizationLearnerParticipationStatuses.STARTED,
      campaignStatus: CampaignParticipationStatuses.SHARED,
    },
  ],
};
