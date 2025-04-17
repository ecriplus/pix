import { usecases } from '../../../../../../src/prescription/campaign/domain/usecases/index.js';
import { CampaignTypes } from '../../../../../../src/prescription/shared/domain/constants.js';
import { KnowledgeElementCollection } from '../../../../../../src/prescription/shared/domain/models/KnowledgeElementCollection.js';
import { KnowledgeElement } from '../../../../../../src/shared/domain/models/KnowledgeElement.js';
import { CampaignReport } from '../../../../../../src/shared/domain/read-models/CampaignReport.js';
import { databaseBuilder, expect } from '../../../../../test-helper.js';

describe('Integration | UseCase | find-paginated-filtered-organization-campaigns', function () {
  context('when cover rate is false', function () {
    it('should return paginated campaign reports for a given organization without cover rate', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      databaseBuilder.factory.buildCampaign({ organizationId });
      databaseBuilder.factory.buildMembership({ organizationId, userId });
      await databaseBuilder.commit();
      // when
      const result = await usecases.findPaginatedFilteredOrganizationCampaigns({
        locale: 'fr',
        organizationId,
        page: { number: 1, size: 4 },
        userId,
      });

      //then
      expect(result.models[0]).to.be.an.instanceof(CampaignReport);
      expect(result.models[0].tubes).to.be.undefined;
    });
  });
  context('when cover rate is true', function () {
    it('should return paginated campaign reports for a given organization with cover rate', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
      const frameworkId = databaseBuilder.factory.learningContent.buildFramework().id;

      const areaId = databaseBuilder.factory.learningContent.buildArea({ frameworkId }).id;

      const competenceId = databaseBuilder.factory.learningContent.buildCompetence({ areaId }).id;

      const tubeId = databaseBuilder.factory.learningContent.buildTube({ competenceId }).id;

      const skillId = databaseBuilder.factory.learningContent.buildSkill({ tubeId, status: 'actif' }).id;

      databaseBuilder.factory.buildCampaignSkill({ campaignId, skillId });

      databaseBuilder.factory.buildMembership({ organizationId, userId });

      const participationUser = databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        userId,
      });

      const ke = databaseBuilder.factory.buildKnowledgeElement({
        status: KnowledgeElement.StatusType.VALIDATED,
        skillId,
        userId: participationUser.userId,
      });

      databaseBuilder.factory.buildKnowledgeElementSnapshot({
        campaignParticipationId: participationUser.id,
        snapshot: new KnowledgeElementCollection([ke]).toSnapshot(),
      });

      await databaseBuilder.commit();
      // when
      const result = await usecases.findPaginatedFilteredOrganizationCampaigns({
        locale: 'fr',
        organizationId,
        page: { number: 1, size: 4 },
        userId,
        withCoverRate: true,
      });

      //then
      expect(result.models[0]).to.be.an.instanceof(CampaignReport);
      expect(result.models[0].tubes[0].id).to.deep.equal('tubeIdA');
      expect(result.models[0].tubes[0].competenceId).to.deep.equal('competenceIdA');
      expect(result.models[0].tubes[0].practicalTitle).to.deep.equal('practicalTitle FR Tube A');
      expect(result.models[0].tubes[0].practicalDescription).to.deep.equal('practicalDescription FR Tube A');
      expect(result.models[0].tubes[0].maxLevel).to.deep.equal(2);
      expect(result.models[0].tubes[0].meanLevel).to.deep.equal(2);
    });
  });
  context('when campaign is type profiles collect', function () {
    it('should return model Campaign Report without cover rate', async function () {
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      databaseBuilder.factory.buildCampaign({
        organizationId,
        type: CampaignTypes.PROFILES_COLLECTION,
      }).id;
      await databaseBuilder.commit();

      const result = await usecases.findPaginatedFilteredOrganizationCampaigns({
        locale: 'fr',
        organizationId,
        page: { number: 1, size: 4 },
        userId,
        withCoverRate: true,
      });

      //then
      expect(result.models[0]).to.be.an.instanceof(CampaignReport);
      expect(result.models[0].tubes).to.be.null;
    });
  });
});
