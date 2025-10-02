import * as checkAuthorizationToAccessCombinedCourse from '../../../../../../src/prescription/campaign/application/usecases/checkCampaignBelongsToCombinedCourse.js';
import { CampaignBelongsToCombinedCourseError } from '../../../../../../src/prescription/campaign/domain/errors.js';
import { catchErr, databaseBuilder, expect } from '../../../../../test-helper.js';

describe('Integration | Campaign | Application | Usecases | checkCampaignBelongsToCombinedCourse', function () {
  let organizationId, campaignId;

  beforeEach(async function () {
    organizationId = databaseBuilder.factory.buildOrganization().id;
    campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;

    await databaseBuilder.commit();
  });

  it('should throw if a campaign belongs to combined course', async function () {
    // given
    databaseBuilder.factory.buildCombinedCourse({
      code: 'ABCDE1234',
      name: 'Mon parcours Combiné',
      organizationId,
      successRequirements: [
        {
          requirement_type: 'campaignParticipations',
          comparison: 'all',
          data: {
            campaignId: {
              data: campaignId,
              comparison: 'equal',
            },
          },
        },
      ],
    });
    await databaseBuilder.commit();

    // when
    const error = await catchErr(checkAuthorizationToAccessCombinedCourse.execute)({ campaignId });

    // then
    expect(error).instanceOf(CampaignBelongsToCombinedCourseError);
  });

  it('should not throw if campaign does not belongs to combined course', async function () {
    const anotherCampaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;

    databaseBuilder.factory.buildCombinedCourse({
      code: 'ABCDE1234',
      name: 'Mon parcours Combiné',
      organizationId,
      successRequirements: [
        {
          requirement_type: 'campaignParticipations',
          comparison: 'all',
          data: {
            campaignId: {
              data: anotherCampaignId,
              comparison: 'equal',
            },
          },
        },
      ],
    });
    await databaseBuilder.commit();

    await expect(checkAuthorizationToAccessCombinedCourse.execute({ campaignId })).fulfilled;
  });
});
