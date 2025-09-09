import { CombinedCourse, CombinedCourseDetails } from '../../../../src/quest/domain/models/CombinedCourse.js';
import { DataForQuest } from '../../../../src/quest/domain/models/DataForQuest.js';
import { Eligibility } from '../../../../src/quest/domain/models/Eligibility.js';
import { Module } from '../../../../src/quest/domain/models/Module.js';
import { Quest } from '../../../../src/quest/domain/models/Quest.js';
import { domainBuilder } from '../domain-builder.js';

function buildCombinedCourseDetails({ combinedCourse, quest, items } = {}) {
  const campaign = domainBuilder.buildCampaign({ name: 'diagnostique', code: 'ABCDIAG1' });
  const module = new Module({
    id: 7,
    slug: 'slug',
    title: 'title',
    duration: 10,
    version: '',
  });
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
        {
          requirement_type: 'passages',
          comparison: 'all',
          data: {
            moduleId: {
              data: module.id,
              comparison: 'equal',
            },
          },
        },
      ],
    });

  combinedCourse =
    combinedCourse ?? new CombinedCourse({ id: 1, code: 'COMBINIX1', organizationId: 1, name: 'Mon parcours' });

  const encryptedCombinedCourseUrl = 'encryptedCombinedCourseUrl';
  const combinedCourseDetails = new CombinedCourseDetails(combinedCourse, quest);
  const dataForQuest = new DataForQuest({
    eligibility: new Eligibility({
      campaignParticipations: [],
      passages: [],
    }),
  });
  combinedCourseDetails.generateItems({
    itemDetails: items ?? [campaign, module],
    encryptedCombinedCourseUrl,
    dataForQuest,
  });

  return combinedCourseDetails;
}

export { buildCombinedCourseDetails };
