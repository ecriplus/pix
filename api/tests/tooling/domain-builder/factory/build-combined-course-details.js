import { CombinedCourse, CombinedCourseDetails } from '../../../../src/quest/domain/models/CombinedCourse.js';
import { Quest } from '../../../../src/quest/domain/models/Quest.js';
import { domainBuilder } from '../domain-builder.js';

function buildCombinedCourseDetails({ combinedCourse, quest, items } = {}) {
  const campaign = domainBuilder.buildCampaign({ name: 'diagnostique', code: 'ABCDIAG1' });

  quest =
    quest ??
    new Quest({
      id: 1,
      rewardId: null,
      rewardType: null,
      eligibilityRequirements: [],
      successRequirements: [
        {
          requirement_type: 'campaignParticipations',
          comparison: 'all',
          data: {
            campaignId: {
              data: campaign.id,
              comparison: 'equal',
            },
          },
        },
      ],
    });

  combinedCourse =
    combinedCourse ?? new CombinedCourse({ id: 1, code: 'COMBINIX1', organizationId: 1, name: 'Mon parcours' });

  const combinedCourseDetails = new CombinedCourseDetails(combinedCourse, quest);
  combinedCourseDetails.generateItems(items ?? [campaign]);

  return combinedCourseDetails;
}

export { buildCombinedCourseDetails };
