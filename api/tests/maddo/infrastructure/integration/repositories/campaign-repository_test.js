import { Campaign } from '../../../../../src/maddo/domain/models/Campaign.js';
import { findByOrganizationId } from '../../../../../src/maddo/infrastructure/repositories/campaign-repository.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Maddo | Infrastructure | Repositories | Integration | campaign', function () {
  describe('#findByOrganizationId', function () {
    it('lists campaigns belonging to organization with given id', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();
      const { id: otherOrganizationId } = databaseBuilder.factory.buildOrganization();
      const targetProfile = databaseBuilder.factory.buildTargetProfile();
      const campaign1 = databaseBuilder.factory.buildCampaign({
        organizationId: organization.id,
        targetProfileId: targetProfile.id,
      });
      const campaign2 = databaseBuilder.factory.buildCampaign({
        organizationId: organization.id,
        targetProfileId: targetProfile.id,
      });
      databaseBuilder.factory.buildCampaign({ organizationId: otherOrganizationId });
      await databaseBuilder.commit();

      // when
      const campaigns = await findByOrganizationId(organization.id);

      // then
      expect(campaigns).to.deep.equal([
        new Campaign({
          id: campaign1.id,
          name: campaign1.name,
          organizationId: organization.id,
          organizationName: organization.name,
          type: campaign1.type,
          targetProfileId: targetProfile.id,
          targetProfileName: targetProfile.name,
          code: campaign1.code,
          createdAt: campaign1.createdAt,
        }),
        new Campaign({
          id: campaign2.id,
          name: campaign2.name,
          organizationId: organization.id,
          organizationName: organization.name,
          type: campaign2.type,
          targetProfileId: targetProfile.id,
          targetProfileName: targetProfile.name,
          code: campaign2.code,
          createdAt: campaign2.createdAt,
        }),
      ]);
    });
  });
});
