import * as organizationLearnerStatisticsRepository from '../../../../../../src/prescription/organization-learner/infrastructure/repositories/organization-learner-statistics-repository.js';
import {
  CampaignParticipationStatuses,
  CampaignTypes,
} from '../../../../../../src/prescription/shared/domain/constants.js';
import { databaseBuilder, expect } from '../../../../../test-helper.js';

describe('Integration | Repository | Organization Learner Statistics', function () {
  describe('#getParticipationStatistics', function () {
    let organizationId, ownerId;

    beforeEach(async function () {
      organizationId = databaseBuilder.factory.buildOrganization().id;
      ownerId = databaseBuilder.factory.buildUser().id;

      await databaseBuilder.commit();
    });

    context('when there are no campaigns', function () {
      it('should return zero counts', async function () {
        // when
        const statistics = await organizationLearnerStatisticsRepository.getParticipationStatistics({
          organizationId,
          ownerId,
        });

        // then
        expect(statistics).to.deep.equal({
          totalParticipationCount: 0,
          completedParticipationCount: 0,
        });
      });
    });

    context('when there are campaigns with participations', function () {
      it('should return correct statistics', async function () {
        // given
        const campaignId1 = databaseBuilder.factory.buildCampaign({
          organizationId,
          ownerId,
        }).id;

        const campaignId2 = databaseBuilder.factory.buildCampaign({
          organizationId,
          ownerId,
          type: CampaignTypes.PROFILES_COLLECTION,
        }).id;

        // Create participations: 2 shared, 1 started, 1 to_share
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaignId1,
          status: CampaignParticipationStatuses.SHARED,
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaignId1,
          status: CampaignParticipationStatuses.SHARED,
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaignId2,
          status: CampaignParticipationStatuses.STARTED,
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaignId2,
          status: CampaignParticipationStatuses.TO_SHARE,
        });

        await databaseBuilder.commit();

        // when
        const statistics = await organizationLearnerStatisticsRepository.getParticipationStatistics({
          organizationId,
          ownerId,
        });

        // then
        expect(statistics).to.deep.equal({
          totalParticipationCount: 4,
          completedParticipationCount: 2,
        });
      });
    });

    context('when there are campaigns from other organizations or owners', function () {
      it('should not include them in statistics', async function () {
        // given
        const otherOrganizationId = databaseBuilder.factory.buildOrganization().id;
        const otherOwnerId = databaseBuilder.factory.buildUser().id;

        // Campaign from target organization but different owner
        const campaignId1 = databaseBuilder.factory.buildCampaign({
          organizationId,
          ownerId: otherOwnerId,
        }).id;

        // Campaign from different organization but same owner
        const campaignId2 = databaseBuilder.factory.buildCampaign({
          organizationId: otherOrganizationId,
          ownerId,
        }).id;

        // Target campaign
        const campaignId3 = databaseBuilder.factory.buildCampaign({
          organizationId,
          ownerId,
        }).id;

        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaignId1,
          status: CampaignParticipationStatuses.SHARED,
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaignId2,
          status: CampaignParticipationStatuses.SHARED,
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaignId3,
          status: CampaignParticipationStatuses.SHARED,
        });

        await databaseBuilder.commit();

        // when
        const statistics = await organizationLearnerStatisticsRepository.getParticipationStatistics({
          organizationId,
          ownerId,
        });

        // then
        expect(statistics).to.deep.equal({
          totalParticipationCount: 1,
          completedParticipationCount: 1,
        });
      });
    });

    context('when campaigns are deleted or archived', function () {
      it('should not include them in statistics', async function () {
        // given
        const deletedCampaignId = databaseBuilder.factory.buildCampaign({
          organizationId,
          ownerId,

          deletedAt: new Date('2023-01-01'),
        }).id;

        const archivedCampaignId = databaseBuilder.factory.buildCampaign({
          organizationId,
          ownerId,

          archivedAt: new Date('2023-01-01'),
        }).id;

        const activeCampaignId = databaseBuilder.factory.buildCampaign({
          organizationId,
          ownerId,
        }).id;

        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: deletedCampaignId,
          status: CampaignParticipationStatuses.SHARED,
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: archivedCampaignId,
          status: CampaignParticipationStatuses.SHARED,
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: activeCampaignId,
          status: CampaignParticipationStatuses.SHARED,
        });

        await databaseBuilder.commit();

        // when
        const statistics = await organizationLearnerStatisticsRepository.getParticipationStatistics({
          organizationId,
          ownerId,
        });

        // then
        expect(statistics).to.deep.equal({
          totalParticipationCount: 1,
          completedParticipationCount: 1,
        });
      });
    });

    context('when there are participations with all possible statuses', function () {
      it('should only count SHARED status as completed', async function () {
        // given
        const campaignId = databaseBuilder.factory.buildCampaign({
          organizationId,
          ownerId,
          type: CampaignTypes.PROFILES_COLLECTION,
        }).id;

        // Create participations with all possible statuses
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          status: CampaignParticipationStatuses.STARTED,
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          status: CampaignParticipationStatuses.TO_SHARE,
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          status: CampaignParticipationStatuses.SHARED,
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          status: CampaignParticipationStatuses.SHARED,
        });

        await databaseBuilder.commit();

        // when
        const statistics = await organizationLearnerStatisticsRepository.getParticipationStatistics({
          organizationId,
          ownerId,
        });

        // then
        expect(statistics).to.deep.equal({
          totalParticipationCount: 4,
          completedParticipationCount: 2,
        });
      });
    });
  });
});
