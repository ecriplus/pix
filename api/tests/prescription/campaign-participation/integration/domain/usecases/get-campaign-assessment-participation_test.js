import { CampaignAssessmentParticipation } from '../../../../../../src/prescription/campaign-participation/domain/models/CampaignAssessmentParticipation.js';
import { usecases } from '../../../../../../src/prescription/campaign-participation/domain/usecases/index.js';
import {
  CampaignParticipationStatuses,
  CampaignTypes,
} from '../../../../../../src/prescription/shared/domain/constants.js';
import { Assessment } from '../../../../../../src/shared/domain/models/Assessment.js';
import { databaseBuilder, expect, mockLearningContent } from '../../../../../test-helper.js';

describe('Integration | UseCase | get-campaign-assessment-participation', function () {
  let userId, campaignId, campaignParticipationId, targetProfileId;

  context('when user has access to organization that owns campaign', function () {
    beforeEach(async function () {
      const skillId = 'recArea1_Competence1_Tube1_Skill1';
      const learningContent = {
        areas: [{ id: 'recArea1', competenceIds: ['recArea1_Competence1'] }],
        competences: [
          {
            id: 'recArea1_Competence1',
            areaId: 'recArea1',
            skillIds: [skillId],
            origin: 'Pix',
          },
        ],
        thematics: [],
        tubes: [
          {
            id: 'recArea1_Competence1_Tube1',
            competenceId: 'recArea1_Competence1',
          },
        ],
        skills: [
          {
            id: skillId,
            name: '@recArea1_Competence1_Tube1_Skill1',
            status: 'actif',
            tubeId: 'recArea1_Competence1_Tube1',
            competenceId: 'recArea1_Competence1',
          },
        ],
        challenges: [
          {
            id: 'recArea1_Competence1_Tube1_Skill1_Challenge1',
            skillId: skillId,
            competenceId: 'recArea1_Competence1',
            status: 'validé',
            locales: ['fr-fr'],
          },
        ],
      };

      await mockLearningContent(learningContent);

      const organizationId = databaseBuilder.factory.buildOrganization().id;
      userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildMembership({ organizationId, userId });
      const organizationLearnerId = databaseBuilder.factory.prescription.organizationLearners.buildOrganizationLearner({
        userId,
        organizationId,
      }).id;
      targetProfileId = databaseBuilder.factory.buildTargetProfile({ ownerOrganizationId: organizationId }).id;

      campaignId = databaseBuilder.factory.buildCampaign({
        type: CampaignTypes.ASSESSMENT,
        targetProfileId,
        organizationId,
        creatorId: userId,
        ownerId: userId,
      }).id;

      databaseBuilder.factory.buildCampaignSkill({ campaignId, skillId });

      campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        userId,
        status: CampaignParticipationStatuses.STARTED,
        organizationLearnerId,
        masteryRate: 0,
        validatedSkillsCount: 0,
      }).id;
      databaseBuilder.factory.buildAssessment({
        campaignParticipationId,
        userId,
        type: Assessment.types.CAMPAIGN,
        state: Assessment.states.STARTED,
      });

      await databaseBuilder.commit();
    });

    it('should get the campaignAssessmentParticipation', async function () {
      // when
      const result = await usecases.getCampaignAssessmentParticipation({
        userId,
        campaignId,
        campaignParticipationId,
      });

      // then
      expect(result).to.instanceOf(CampaignAssessmentParticipation);
    });

    context('badges', function () {
      let badgeId;

      beforeEach(async function () {
        // given
        badgeId = databaseBuilder.factory.buildBadge({ key: 'badge1', targetProfileId }).id;

        await databaseBuilder.commit();
      });

      it('should not set badges when participation has none', async function () {
        // when
        const result = await usecases.getCampaignAssessmentParticipation({
          userId,
          campaignId,
          campaignParticipationId,
        });

        // then
        expect(result.badges).to.be.undefined;
      });

      it('should set badges when participation obtained some', async function () {
        databaseBuilder.factory.buildBadgeAcquisition({
          userId,
          badgeId,
          campaignParticipationId,
          createdAt: new Date('2020-01-01'),
        });

        await databaseBuilder.commit();

        // when
        const result = await usecases.getCampaignAssessmentParticipation({
          userId,
          campaignId,
          campaignParticipationId,
        });

        // then
        expect(result.badges).to.lengthOf(1);
      });
    });

    context('stages', function () {
      it('should set stages when participation', async function () {
        // given
        databaseBuilder.factory.buildStage({
          targetProfileId,
          level: 1,
          prescriberTitle: 'palier 0',
          prescriberDescription: 'message 0',
          threshold: null,
        });
        databaseBuilder.factory.buildStage({
          targetProfileId,
          isFirstSkill: true,
          level: null,
          prescriberTitle: 'premier acquis',
          prescriberDescription: 'premier acquis',
          threshold: null,
        });

        await databaseBuilder.commit();

        // when
        const result = await usecases.getCampaignAssessmentParticipation({
          userId,
          campaignId,
          campaignParticipationId,
        });

        // then
        expect(result.totalStage).to.be.equal(2);
        expect(result.reachedStage).to.be.equal(1);
        expect(result.prescriberTitle).to.be.equal('palier 0');
        expect(result.prescriberDescription).to.be.equal('message 0');
      });

      it('should not set stages when target profile does not have stages', async function () {
        // when
        const result = await usecases.getCampaignAssessmentParticipation({
          userId,
          campaignId,
          campaignParticipationId,
        });

        // then
        expect(result.totalStage).to.be.null;
        expect(result.reachedStage).to.be.null;
        expect(result.prescriberTitle).to.be.null;
        expect(result.prescriberDescription).to.be.null;
      });
    });
  });
});
