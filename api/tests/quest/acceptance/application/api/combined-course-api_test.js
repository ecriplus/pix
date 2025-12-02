import { CampaignParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import * as combinedCourseApi from '../../../../../src/quest/application/api/combined-course-api.js';
import { CombinedCourse } from '../../../../../src/quest/application/api/CombinedCourse.model.js';
import { MultipleQuestFoundError } from '../../../../../src/quest/application/api/errors.js';
import {
  CRITERION_COMPARISONS,
  REQUIREMENT_COMPARISONS,
  REQUIREMENT_TYPES,
} from '../../../../../src/quest/domain/models/Quest.js';
import { catchErr, databaseBuilder, expect } from '../../../../test-helper.js';

describe('Acceptance | Quest | Application | combined-course-api', function () {
  let organizationId, campaignId, combinedCourseId, combinedCourseName;
  beforeEach(async function () {
    //given
    organizationId = databaseBuilder.factory.buildOrganization().id;
    campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
    combinedCourseName = 'Mon parcours Combiné';
    combinedCourseId = databaseBuilder.factory.buildCombinedCourse({
      code: 'ABCDE1234',
      name: combinedCourseName,
      organizationId,
      successRequirements: [
        {
          requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
          comparison: REQUIREMENT_COMPARISONS.ALL,
          data: {
            campaignId: {
              data: campaignId,
              comparison: CRITERION_COMPARISONS.EQUAL,
            },
            status: {
              data: CampaignParticipationStatuses.SHARED,
              comparison: CRITERION_COMPARISONS.EQUAL,
            },
          },
        },
      ],
    }).id;
    await databaseBuilder.commit();
  });

  it('should return combined courses by campaignId', async function () {
    // when
    const result = await combinedCourseApi.getByCampaignId(campaignId);

    // then
    expect(result).to.be.instanceOf(CombinedCourse);
    expect(result.id).to.equal(combinedCourseId);
    expect(result.name).to.equal(combinedCourseName);
  });

  it('should return null if no combined courses found', async function () {
    //given
    const campaignNotInQuest = databaseBuilder.factory.buildCampaign({ organizationId });
    await databaseBuilder.commit();

    // when
    const result = await combinedCourseApi.getByCampaignId(campaignNotInQuest.id);

    // then
    expect(result).null;
  });

  it('should throw an error if multiple combined courses found', async function () {
    //given
    const organizationId = databaseBuilder.factory.buildOrganization().id;

    databaseBuilder.factory.buildCombinedCourse({
      code: 'QWERTY123',
      name: combinedCourseName,
      organizationId,
      successRequirements: [
        {
          requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
          comparison: REQUIREMENT_COMPARISONS.ALL,
          data: {
            campaignId: {
              data: campaignId,
              comparison: CRITERION_COMPARISONS.EQUAL,
            },
            status: {
              data: CampaignParticipationStatuses.SHARED,
              comparison: CRITERION_COMPARISONS.EQUAL,
            },
          },
        },
      ],
      rewardId: null,
      rewardType: null,
    });

    await databaseBuilder.commit();

    // when
    const error = await catchErr(combinedCourseApi.getByCampaignId)(campaignId);

    // then
    expect(error).instanceOf(MultipleQuestFoundError);
  });
});
