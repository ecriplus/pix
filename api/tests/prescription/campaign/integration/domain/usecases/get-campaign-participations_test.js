import {
  AssessmentCampaignParticipation,
  ProfilesCollectionCampaignParticipation,
} from '../../../../../../src/prescription/campaign/domain/read-models/CampaignParticipation.js';
import { usecases } from '../../../../../../src/prescription/campaign/domain/usecases/index.js';
import { KnowledgeElementCollection } from '../../../../../../src/prescription/shared/domain/models/KnowledgeElementCollection.js';
import { LOCALE } from '../../../../../../src/shared/domain/constants.js';
import {
  CampaignParticipationStatuses,
  CampaignTypes,
  KnowledgeElement,
} from '../../../../../../src/shared/domain/models/index.js';
import { databaseBuilder, expect } from '../../../../../test-helper.js';
const { FRENCH_SPOKEN } = LOCALE;

describe('Integration | UseCase | get-campaign-participations', function () {
  context('when campaign type is assessment', function () {
    it('should return all participations for given campaign', async function () {
      // given
      const frameworkId = databaseBuilder.factory.learningContent.buildFramework().id;
      const areaId = databaseBuilder.factory.learningContent.buildArea({ frameworkId }).id;
      const competenceId = databaseBuilder.factory.learningContent.buildCompetence({ areaId }).id;
      const tube = databaseBuilder.factory.learningContent.buildTube({ competenceId });
      const skillId = databaseBuilder.factory.learningContent.buildSkill({ tubeId: tube.id, status: 'actif' }).id;

      const organizationLearner1 = databaseBuilder.factory.buildOrganizationLearner();
      const campaign = databaseBuilder.factory.buildCampaign({ type: CampaignTypes.ASSESSMENT });
      databaseBuilder.factory.buildCampaignSkill({ campaignId: campaign.id, skillId });
      const participation1 = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: CampaignParticipationStatuses.SHARED,
        organizationLearnerId: organizationLearner1.id,
        masteryRate: 0.1,
        pixScore: 42,
        validatedSkillsCount: 10,
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
        masteryRate: null,
        pixScore: null,
        validatedSkillsCount: null,
      });
      databaseBuilder.factory.buildCampaignParticipation({
        status: CampaignParticipationStatuses.STARTED,
        masteryRate: 0.5,
      });

      await databaseBuilder.commit();

      // when
      const participations = await usecases.getCampaignParticipations({
        campaignId: campaign.id,
        locale: FRENCH_SPOKEN,
      });

      // then
      expect(participations).to.have.lengthOf(2);
      expect(participations).to.deep.members([
        new AssessmentCampaignParticipation({
          campaignParticipationId: participation1.id,
          userId: participation1.userId,
          participantExternalId: participation1.participantExternalId,
          status: participation1.status,
          masteryRate: participation1.masteryRate,
          createdAt: participation1.createdAt,
          sharedAt: participation1.sharedAt,
          participantFirstName: organizationLearner1.firstName,
          participantLastName: organizationLearner1.lastName,
          tubes: [
            {
              id: tube.id,
              competenceId,
              maxLevel: 2,
              meanLevel: 2,
              practicalDescription: tube.practicalDescription_i18n['fr'],
              practicalTitle: tube.practicalTitle_i18n['fr'],
            },
          ],
        }),
        new AssessmentCampaignParticipation({
          campaignParticipationId: participation2.id,
          userId: participation2.userId,
          participantExternalId: participation2.participantExternalId,
          status: participation2.status,
          masteryRate: participation2.masteryRate,
          createdAt: participation2.createdAt,
          sharedAt: participation2.sharedAt,
          participantFirstName: organizationLearner2.firstName,
          participantLastName: organizationLearner2.lastName,
          tubes: undefined,
        }),
      ]);
    });
  });
  context('when campaign type is profile collection', function () {
    it('should return all participations for given campaign', async function () {
      // given
      const campaign = databaseBuilder.factory.buildCampaign({ type: CampaignTypes.PROFILES_COLLECTION });
      const organizationLearner1 = databaseBuilder.factory.buildOrganizationLearner();
      const participation1 = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: CampaignParticipationStatuses.SHARED,
        organizationLearnerId: organizationLearner1.id,
        masteryRate: 0.1,
        pixScore: 42,
        validatedSkillsCount: 10,
      });
      const organizationLearner2 = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organizationLearner1.organizationId,
      });
      const participation2 = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: CampaignParticipationStatuses.STARTED,
        organizationLearnerId: organizationLearner2.id,
        masteryRate: 0.3,
        pixScore: 21,
        validatedSkillsCount: 10,
      });
      databaseBuilder.factory.buildCampaignParticipation({
        status: CampaignParticipationStatuses.STARTED,
        masteryRate: 0.5,
      });

      await databaseBuilder.commit();

      // when
      const participations = await usecases.getCampaignParticipations({
        campaignId: campaign.id,
        locale: FRENCH_SPOKEN,
      });

      //then
      expect(participations).to.have.lengthOf(2);
      expect(participations[0]).instanceOf(ProfilesCollectionCampaignParticipation);
      expect(participations[1]).instanceOf(ProfilesCollectionCampaignParticipation);
      expect(participations).to.deep.members([
        {
          campaignParticipationId: participation1.id,
          userId: participation1.userId,
          participantExternalId: participation1.participantExternalId,
          status: participation1.status,
          createdAt: participation1.createdAt,
          sharedAt: participation1.sharedAt,
          pixScore: participation1.pixScore,
          participantFirstName: organizationLearner1.firstName,
          participantLastName: organizationLearner1.lastName,
        },
        {
          campaignParticipationId: participation2.id,
          userId: participation2.userId,
          participantExternalId: participation2.participantExternalId,
          status: participation2.status,
          createdAt: participation2.createdAt,
          sharedAt: participation2.sharedAt,
          pixScore: participation2.pixScore,
          participantFirstName: organizationLearner2.firstName,
          participantLastName: organizationLearner2.lastName,
        },
      ]);
    });
  });
});
