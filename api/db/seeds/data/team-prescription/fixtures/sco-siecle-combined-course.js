import { faker } from '@faker-js/faker';

import { CampaignParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { OrganizationLearnerParticipationStatuses } from '../../../../../src/quest/domain/models/OrganizationLearnerParticipation.js';
import { SCO_MANAGING_ORGANIZATION_ID } from '../../common/constants.js';

export const SCO_SIECLE_COMBINED_COURSE = {
  organizationId: SCO_MANAGING_ORGANIZATION_ID,
  quest: {
    code: 'SCOMBINIX',
    name: 'Parcours combine sco SIECLE',
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
