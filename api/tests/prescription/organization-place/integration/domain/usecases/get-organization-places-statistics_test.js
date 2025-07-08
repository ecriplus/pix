import dayjs from 'dayjs';

import { usecases } from '../../../../../../src/prescription/organization-place/domain/usecases/index.js';
import { databaseBuilder, expect } from '../../../../../test-helper.js';

describe('Integration | Domain | Use Cases | get-organization-places-statistics', function () {
  it('should get the organization places statistics', async function () {
    // given
    const organizationId = databaseBuilder.factory.buildOrganization().id;

    const anonymousUserId = databaseBuilder.factory.buildUser({ isAnonymous: true }).id;
    const realUserId = databaseBuilder.factory.buildUser({ isAnonymous: false }).id;

    const anonymousLearnerId = databaseBuilder.factory.buildOrganizationLearner({
      userId: anonymousUserId,
      organizationId,
    }).id;
    const realLearnerId = databaseBuilder.factory.buildOrganizationLearner({ userId: realUserId, organizationId }).id;

    const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;

    databaseBuilder.factory.buildCampaignParticipation();

    databaseBuilder.factory.buildCampaignParticipation({
      campaignId,
      organizationLearnerId: anonymousLearnerId,
      userId: anonymousUserId,
    });
    databaseBuilder.factory.buildCampaignParticipation({
      campaignId,
      organizationLearnerId: realLearnerId,
      userId: realUserId,
    });

    databaseBuilder.factory.buildOrganizationPlace({
      organizationId,
      activationDate: dayjs().subtract(1, 'months').toDate(),
      count: 100,
    });

    await databaseBuilder.commit();

    // when
    const organizationPlacesStatistics = await usecases.getOrganizationPlacesStatistics({
      organizationId,
    });

    // then
    expect(organizationPlacesStatistics.total).to.equal(100);
    expect(organizationPlacesStatistics.occupied).to.equal(2);
    expect(organizationPlacesStatistics.anonymousSeat).to.equal(1);
    expect(organizationPlacesStatistics.available).to.equal(98);
    expect(organizationPlacesStatistics.hasReachMaximumPlacesWithThreshold).to.equal(false);
  });
});
