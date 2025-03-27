import { CampaignParticipation } from '../../../../../src/maddo/domain/models/CampaignParticipation.js';
import { findByCampaignId } from '../../../../../src/maddo/infrastructure/repositories/campaign-participation-repository.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Maddo | Infrastructure | Repositories | Integration | campaign-participation', function () {
  describe('#findByCampaignId', function () {
    it('lists campaign participations belonging to campaign with given id', async function () {
      // given
      const campaign1 = databaseBuilder.factory.buildCampaign();
      const campaign2 = databaseBuilder.factory.buildCampaign();

      const campaignParticipation1 = databaseBuilder.factory.buildCampaignParticipation({ campaignId: campaign1.id });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId: campaign2.id });
      const campaignParticipation3 = databaseBuilder.factory.buildCampaignParticipation({ campaignId: campaign1.id });
      await databaseBuilder.commit();

      const expectedCampaignParticipations = [
        new CampaignParticipation(campaignParticipation1),
        new CampaignParticipation(campaignParticipation3),
      ];

      // when
      const campaignParticipations = await findByCampaignId(campaign1.id);

      // then
      expect(campaignParticipations).to.deep.equal(expectedCampaignParticipations);
    });
  });
});
