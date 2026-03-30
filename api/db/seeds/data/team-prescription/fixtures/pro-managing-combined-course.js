import { PRO_MANAGING_ORGANIZATION_ID } from '../../common/constants.js';
import { CAMPAIGN_PRO_GENERIC_COMBINED_COURSE_ID } from '../constants.js';

export const PRO_MANAGING_COMBINED_COURSE = {
  organizationId: PRO_MANAGING_ORGANIZATION_ID,
  quest: {
    code: 'MANAGING1',
    name: 'Parcours apprenant organisation import générique',
    combinedCourseContents: [
      {
        campaignId: CAMPAIGN_PRO_GENERIC_COMBINED_COURSE_ID,
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
    description: 'Description parcours managing 1',
    name: 'Parcours managing 1',
    stages: [],
    tubes: [],
    campaign: {
      id: CAMPAIGN_PRO_GENERIC_COMBINED_COURSE_ID,
      name: 'Je teste mes compétences',
      code: 'CODE999',
      customResultPageButtonText: 'Continuer',
      customResultPageButtonUrl: '/parcours/MANAGING1/chargement',
      skills: [],
    },
    trainings: [],
  },
  participations: [],
};
