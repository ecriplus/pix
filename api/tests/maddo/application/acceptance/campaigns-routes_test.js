import { CampaignParticipationStatuses, CampaignTypes } from '../../../../src/prescription/shared/domain/constants.js';
import { KnowledgeElementCollection } from '../../../../src/prescription/shared/domain/models/KnowledgeElementCollection.js';
import { KnowledgeElement } from '../../../../src/shared/domain/models/index.js';
import {
  createMaddoServer,
  databaseBuilder,
  domainBuilder,
  expect,
  generateValidRequestAuthorizationHeaderForApplication,
} from '../../../test-helper.js';

describe('Acceptance | Maddo | Route | Campaigns', function () {
  let server;

  beforeEach(async function () {
    server = await createMaddoServer();
  });

  describe('GET /api/campaigns/{campaignId}/participations', function () {
    it('returns the list of all participations of campaign with an HTTP status code 200', async function () {
      // given
      const orgaInJurisdiction = databaseBuilder.factory.buildOrganization({ name: 'orga-in-jurisdiction' });
      databaseBuilder.factory.buildOrganization({ name: 'orga-not-in-jurisdiction' });

      const tag = databaseBuilder.factory.buildTag();
      databaseBuilder.factory.buildOrganizationTag({ organizationId: orgaInJurisdiction.id, tagId: tag.id });

      const clientId = 'client';
      databaseBuilder.factory.buildClientApplication({
        clientId: 'client',
        jurisdiction: { rules: [{ name: 'tags', value: [tag.name] }] },
      });

      const frameworkId = databaseBuilder.factory.learningContent.buildFramework().id;
      const areaId = databaseBuilder.factory.learningContent.buildArea({ frameworkId }).id;
      const competenceId = databaseBuilder.factory.learningContent.buildCompetence({ areaId }).id;
      const tube = databaseBuilder.factory.learningContent.buildTube({ competenceId });
      const skillId = databaseBuilder.factory.learningContent.buildSkill({ tubeId: tube.id, status: 'actif' }).id;

      const { id: userId } = databaseBuilder.factory.buildUser({
        firstName: 'user firstname 1',
        lastName: 'user lastname 1',
      });
      const organizationLearner1 = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: orgaInJurisdiction.id,
        userId,
        firstName: 'firstname 1',
        lastName: 'lastname 1',
      });
      const campaign = databaseBuilder.factory.buildCampaign({
        type: CampaignTypes.ASSESSMENT,
        organizationId: orgaInJurisdiction.id,
      });
      databaseBuilder.factory.buildCampaignSkill({ campaignId: campaign.id, skillId });
      const participation1 = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: CampaignParticipationStatuses.SHARED,
        organizationLearnerId: organizationLearner1.id,
        masteryRate: 0.1,
        pixScore: 42,
        validatedSkillsCount: 10,
        userId,
        participantExternalId: 'external id 1',
        createdAt: new Date('2025-01-02'),
        sharedAt: new Date('2025-01-03'),
      });
      const ke = databaseBuilder.factory.buildKnowledgeElement({
        status: KnowledgeElement.StatusType.VALIDATED,
        skillId,
        userId: participation1.userId,
      });

      databaseBuilder.factory.buildKnowledgeElementSnapshot({
        campaignParticipationId: participation1.id,
        snapshot: new KnowledgeElementCollection([ke]).toSnapshot(),
      });

      const organizationLearner2 = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organizationLearner1.organizationId,
      });
      const participation2 = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: CampaignParticipationStatuses.STARTED,
        organizationLearnerId: organizationLearner2.id,
        userId: organizationLearner2.userId,
      });

      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: `/api/campaigns/${campaign.id}/participations`,
        headers: {
          authorization: generateValidRequestAuthorizationHeaderForApplication(
            clientId,
            'pix-client',
            'campaigns meta',
          ),
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.deep.members([
        domainBuilder.maddo.buildCampaignParticipation({ ...participation1, clientId }),
        domainBuilder.maddo.buildCampaignParticipation({ ...participation2, clientId }),
      ]);
    });
  });
});
