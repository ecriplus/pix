import { PIX_ADMIN } from '../../../../../../src/authorization/domain/constants.js';
import * as campaignApi from '../../../../../../src/prescription/campaign/application/api/campaigns-api.js';
import { CampaignParticipation } from '../../../../../../src/prescription/campaign/application/api/models/CampaignParticipation.js';
import { SavedCampaign } from '../../../../../../src/prescription/campaign/application/api/models/SavedCampaign.js';
import { UserNotAuthorizedToCreateCampaignError } from '../../../../../../src/prescription/campaign/domain/errors.js';
import {
  CampaignParticipationStatuses,
  CampaignTypes,
} from '../../../../../../src/prescription/shared/domain/constants.js';
import { KnowledgeElementCollection } from '../../../../../../src/prescription/shared/domain/models/KnowledgeElementCollection.js';
import { ORGANIZATION_FEATURE } from '../../../../../../src/shared/domain/constants.js';
import { KnowledgeElement } from '../../../../../../src/shared/domain/models/KnowledgeElement.js';
import { catchErr, databaseBuilder, expect, knex } from '../../../../../test-helper.js';

describe('Integration | Application | campaign-api', function () {
  describe('#findAllForOrganization', function () {
    it('should not fail without page args', async function () {
      const organizationId = databaseBuilder.factory.buildOrganization().id;

      databaseBuilder.factory.buildCampaign({ organizationId });
      databaseBuilder.factory.buildCampaign({ organizationId });
      databaseBuilder.factory.buildCampaign();

      await databaseBuilder.commit();

      const result = await campaignApi.findAllForOrganization({ organizationId });

      expect(result.models.length).to.be.equal(2);
    });

    it('should take pagination in consideration', async function () {
      const organizationId = databaseBuilder.factory.buildOrganization().id;

      databaseBuilder.factory.buildCampaign({ organizationId });
      const campaignId2 = databaseBuilder.factory.buildCampaign({ organizationId }).id;
      databaseBuilder.factory.buildCampaign();

      await databaseBuilder.commit();

      const result = await campaignApi.findAllForOrganization({ organizationId, page: { size: 1, number: 2 } });

      expect(result.models.length).to.be.equal(1);
      expect(result.models[0].id).to.deep.equal(campaignId2);
      expect(result.meta.pageCount).to.equal(2);
    });
  });

  describe('#getCampaignParticipations', function () {
    it('should return an array of campaign participations', async function () {
      // given
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
        userId,
        firstName: 'firstname 1',
        lastName: 'lastname 1',
      });
      const campaign = databaseBuilder.factory.buildCampaign({ type: CampaignTypes.ASSESSMENT });
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
        createdAt: new Date('2025-01-02'),
      });

      const organizationLearner3 = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organizationLearner1.organizationId,
        lastName: 'zoé',
      });

      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: CampaignParticipationStatuses.STARTED,
        organizationLearnerId: organizationLearner3.id,
        userId: organizationLearner3.userId,
        participantExternalId: 'participation before date filter',
        createdAt: new Date('2024-12-03'),
      });

      await databaseBuilder.commit();

      // when
      const result = await campaignApi.getCampaignParticipations({
        campaignId: campaign.id,
        locale: 'fr',
        page: { size: 2, number: 1 },
        since: new Date('2024-12-25'),
      });

      // then
      expect(result.models[0]).instanceOf(CampaignParticipation);
      expect(result.models[1]).instanceOf(CampaignParticipation);
      expect(result.models).to.deep.equal([
        {
          campaignParticipationId: participation2.id,
          participantFirstName: organizationLearner2.firstName,
          participantLastName: organizationLearner2.lastName,
          participantExternalId: participation2.participantExternalId,
          userId: organizationLearner2.userId,
          createdAt: participation2.createdAt,
          sharedAt: null,
          masteryRate: null,
          status: CampaignParticipationStatuses.STARTED,
          tubes: undefined,
        },
        {
          campaignParticipationId: participation1.id,
          participantFirstName: 'firstname 1',
          participantLastName: 'lastname 1',
          participantExternalId: 'external id 1',
          userId,
          createdAt: new Date('2025-01-02'),
          sharedAt: new Date('2025-01-03'),
          masteryRate: 0.1,
          status: CampaignParticipationStatuses.SHARED,
          tubes: [
            {
              competenceId: 'competenceIdA',
              id: 'tubeIdA',
              maxLevel: 2,
              reachedLevel: 2,
              practicalDescription: 'practicalDescription FR Tube A',
              practicalTitle: 'practicalTitle FR Tube A',
            },
          ],
        },
      ]);
      expect(result.meta).to.deep.equal({
        page: 1,
        pageCount: 1,
        pageSize: 2,
        rowCount: 2,
      });
    });
  });

  describe('#deleteCampaigns', function () {
    it('should delete campaigns and participations', async function () {
      const admin = databaseBuilder.factory.buildUser();

      const organizationId = databaseBuilder.factory.buildOrganization().id;
      databaseBuilder.factory.buildPixAdminRole({ userId: admin.id, role: PIX_ADMIN.ROLES.SUPPORT });

      const campaignId = databaseBuilder.factory.buildCampaign({
        id: 123,
        organizationId,
        deletedAt: null,
        deletedBy: null,
      }).id;
      databaseBuilder.factory.buildCampaign({
        id: 234,
        organizationId,
      });
      databaseBuilder.factory.buildCampaign();

      const learner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId,
        firstName: 'jacqueline',
        lastName: 'Colson',
        birthdate: new Date('2001-02-03'),
      });
      databaseBuilder.factory.buildOrganizationLearner({ organizationId });

      databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        organizationLearnerId: learner.id,
        userId: learner.userId,
        participantExternalId: 'jacquelineColson@hollywood.net',
        deletedAt: null,
        deleteBy: null,
        isImproved: true,
      });

      databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        organizationLearnerId: learner.id,
        userId: learner.userId,
        participantExternalId: 'jacquelineColson@hollywood.net',
        deletedAt: null,
        deleteBy: null,
        improved: false,
      });

      await databaseBuilder.commit();

      // when
      await campaignApi.deleteActiveCampaigns({ userId: admin.id, organizationId, page: { size: 1 } });

      // then
      const deletedCampaigns = await knex('campaigns').whereNotNull('deletedAt');
      expect(deletedCampaigns).length(2);

      const deletedParticipations = await knex('campaign-participations').whereNotNull('deletedAt');
      expect(deletedParticipations).length(2);
    });
  });

  describe('#save', function () {
    let targetProfileId, organizationId, userId;

    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;
      organizationId = databaseBuilder.factory.buildOrganization().id;
      targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      databaseBuilder.factory.buildTargetProfileShare({
        organizationId,
        targetProfileId,
      });

      await databaseBuilder.commit();
    });
    describe('When one campaign is provided ( not an array )', function () {
      it('should create ASSESSMENT Campaign', async function () {
        databaseBuilder.factory.buildMembership({
          organizationId,
          userId,
        });

        await databaseBuilder.commit();

        const campaign = await campaignApi.save({
          name: 'name campaign',
          title: 'title campaign',
          targetProfileId,
          organizationId,
          creatorId: userId,
        });

        const campaignDb = await knex('campaigns').select('type').where('id', campaign.id).first();

        expect(campaign).instanceOf(SavedCampaign);
        expect(campaignDb.type).equal(CampaignTypes.ASSESSMENT);
      });
      describe('When organization does not have target profile share', function () {
        it('should allow creation if allowCreationWithoutTargetProfileShare is true', async function () {
          const organizationWithoutProfileShareId = databaseBuilder.factory.buildOrganization().id;
          const otherTargetProfileId = databaseBuilder.factory.buildTargetProfile().id;

          databaseBuilder.factory.buildMembership({
            organizationId: organizationWithoutProfileShareId,
            userId,
          });

          await databaseBuilder.commit();

          const campaign = await campaignApi.save(
            {
              name: 'name campaign',
              title: 'title campaign',
              targetProfileId: otherTargetProfileId,
              organizationId: organizationWithoutProfileShareId,
              creatorId: userId,
            },
            {
              allowCreationWithoutTargetProfileShare: true,
            },
          );

          const campaignDb = await knex('campaigns').select('type').where('id', campaign.id).first();

          expect(campaign).instanceOf(SavedCampaign);
          expect(campaignDb.type).equal(CampaignTypes.ASSESSMENT);
        });
        it('should throw an error if allowCreationWithoutTargetProfileShare is not defined', async function () {
          const organizationWithoutProfileShareId = databaseBuilder.factory.buildOrganization().id;
          const otherTargetProfileId = databaseBuilder.factory.buildTargetProfile().id;

          databaseBuilder.factory.buildMembership({
            organizationId: organizationWithoutProfileShareId,
            userId,
          });

          await databaseBuilder.commit();

          const error = await catchErr(campaignApi.save)({
            name: 'name campaign',
            title: 'title campaign',
            targetProfileId: otherTargetProfileId,
            organizationId: organizationWithoutProfileShareId,
            creatorId: userId,
          });

          expect(error).to.be.instanceof(UserNotAuthorizedToCreateCampaignError);
        });
      });
    });

    describe('When mutliple campaign is provided ( an array )', function () {
      it('should create multiple Campaign', async function () {
        const featureId = databaseBuilder.factory.buildFeature({
          key: ORGANIZATION_FEATURE.CAMPAIGN_WITHOUT_USER_PROFILE.key,
        }).id;
        databaseBuilder.factory.buildOrganizationFeature({ featureId, organizationId });
        const externalUserId = databaseBuilder.factory.buildUser().id;

        await databaseBuilder.commit();

        const campaigns = await campaignApi.save([
          {
            name: 'name campaign',
            title: 'title campaign',
            targetProfileId,
            organizationId,
            creatorId: externalUserId,
            ownerId: userId,
            type: CampaignTypes.ASSESSMENT,
          },
          {
            name: 'name campaign',
            organizationId,
            type: CampaignTypes.PROFILES_COLLECTION,
            creatorId: externalUserId,
            ownerId: userId,
          },
          {
            name: 'name campaign',
            title: 'title campaign',
            organizationId,
            type: CampaignTypes.EXAM,
            creatorId: externalUserId,
            ownerId: userId,
            targetProfileId,
          },
        ]);

        expect(campaigns).lengthOf(3);
        expect(campaigns[0].targetProfileId).equal(targetProfileId);
        expect(campaigns[1].targetProfileId).equal(null);
        expect(campaigns[2].targetProfileId).equal(targetProfileId);
      });
      describe('When organization does not have target profile share', function () {
        it('should allow creation if allowCreationWithoutTargetProfileShare is true', async function () {
          const organizationWithoutProfileShareId = databaseBuilder.factory.buildOrganization().id;
          const otherTargetProfileId = databaseBuilder.factory.buildTargetProfile().id;
          const externalUserId = databaseBuilder.factory.buildUser().id;

          databaseBuilder.factory.buildMembership({
            organizationId: organizationWithoutProfileShareId,
            userId,
          });

          await databaseBuilder.commit();

          const campaigns = await campaignApi.save(
            [
              {
                name: 'name campaign 1',
                title: 'title campaign 1',
                targetProfileId: targetProfileId,
                organizationId: organizationWithoutProfileShareId,
                creatorId: externalUserId,
                ownerId: userId,
                type: CampaignTypes.ASSESSMENT,
              },
              {
                name: 'name campaign 2',
                title: 'title campaign 2',
                targetProfileId: otherTargetProfileId,
                organizationId: organizationWithoutProfileShareId,
                creatorId: externalUserId,
                ownerId: userId,
                type: CampaignTypes.ASSESSMENT,
              },
            ],
            {
              allowCreationWithoutTargetProfileShare: true,
            },
          );

          expect(campaigns).lengthOf(2);
        });
        it('should throw an error if allowCreationWithoutTargetProfileShare is not defined', async function () {
          const organizationWithoutProfileShareId = databaseBuilder.factory.buildOrganization().id;
          const otherTargetProfileId = databaseBuilder.factory.buildTargetProfile().id;
          const externalUserId = databaseBuilder.factory.buildUser().id;

          databaseBuilder.factory.buildMembership({
            organizationId: organizationWithoutProfileShareId,
            userId,
          });

          await databaseBuilder.commit();

          const error = await catchErr(campaignApi.save)([
            {
              name: 'name campaign 1',
              title: 'title campaign 1',
              targetProfileId: targetProfileId,
              organizationId: organizationWithoutProfileShareId,
              creatorId: externalUserId,
              ownerId: userId,
              type: CampaignTypes.ASSESSMENT,
            },
            {
              name: 'name campaign 2',
              title: 'title campaign 2',
              targetProfileId: otherTargetProfileId,
              organizationId: organizationWithoutProfileShareId,
              creatorId: externalUserId,
              ownerId: userId,
              type: CampaignTypes.ASSESSMENT,
            },
          ]);

          expect(error).to.be.instanceof(UserNotAuthorizedToCreateCampaignError);
        });
      });
    });
  });
});
