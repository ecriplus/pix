import { faker } from '@faker-js/faker';

import { OrganizationLearnerParticipationStatuses } from '../../../../../src/quest/domain/models/OrganizationLearnerParticipation.js';
import { PRO_ORGANIZATION_ID } from '../../common/constants.js';

export const COMBINED_COURSE_WITHOUT_CAMPAIGN = {
  organizationId: PRO_ORGANIZATION_ID,
  quest: {
    code: 'CBNOCAMP',
    name: 'Combinix sans campagne',
    eligibilityRequirements: [],
    successRequirements: [
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
    ],
  },
  participations: [
    {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.exampleEmail(),
      status: OrganizationLearnerParticipationStatuses.STARTED,
    },
  ],
};
