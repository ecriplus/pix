import { Campaign } from '../../../../../src/profile/domain/models/Campaign.js';
import { getCampaignByParticipationId } from '../../../../../src/profile/infrastructure/repositories/campaign-participation-repository.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Profile | Integration | Infrastructure | Repository | campaign-participation-repository', function () {
  describe('#getCampaignByParticipationId', function () {
    it('return campaign informations for given campaignParticipationId', async function () {
      // given
      const campaign = databaseBuilder.factory.buildCampaign();
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
      }).id;
      await databaseBuilder.commit();

      // when
      const result = await getCampaignByParticipationId({ campaignParticipationId });

      // then
      expect(result).to.be.an.instanceOf(Campaign);
      expect(result.id).to.equal(campaign.id);
      expect(result.organizationId).to.equal(campaign.organizationId);
    });

    it('return null if campaignParticipation does not exist', async function () {
      // given
      const notExistingCampaignParticipation = 123;

      // when
      const result = await getCampaignByParticipationId({ campaignParticipationId: notExistingCampaignParticipation });

      // then
      expect(result).to.be.null;
    });

    it('return null if campaignParticipation does not have linked campaign', async function () {
      // given
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId: null }).id;

      // when
      const result = await getCampaignByParticipationId({ campaignParticipationId });

      // then
      expect(result).to.be.null;
    });
  });
});
