import { findByCampaignId } from '../../../../../src/maddo/infrastructure/repositories/campaign-participation-repository.js';
import { databaseBuilder, domainBuilder, expect } from '../../../../test-helper.js';

describe('Maddo | Infrastructure | Repositories | Integration | campaign-participation', function () {
  describe('#findByCampaignId', function () {
    it('lists campaign participations belonging to campaign with given id', async function () {
      // given
      const clientId = 'client-id';
      const campaign1 = databaseBuilder.factory.buildCampaign();
      const campaign2 = databaseBuilder.factory.buildCampaign();

      const campaignParticipation1 = databaseBuilder.factory.buildCampaignParticipation({ campaignId: campaign1.id });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId: campaign2.id });
      const campaignParticipation3 = databaseBuilder.factory.buildCampaignParticipation({ campaignId: campaign1.id });
      await databaseBuilder.commit();

      const expectedCampaignParticipations = [
        domainBuilder.maddo.buildCampaignParticipation({ ...campaignParticipation1, clientId }),
        domainBuilder.maddo.buildCampaignParticipation({ ...campaignParticipation3, clientId }),
      ];

      // when
      const campaignParticipations = await findByCampaignId(campaign1.id, clientId);

      // then
      expect(campaignParticipations).to.deep.equal(expectedCampaignParticipations);
    });
  });
});
