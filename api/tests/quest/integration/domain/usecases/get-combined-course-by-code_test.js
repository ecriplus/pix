import { CampaignParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { CombinedCourse } from '../../../../../src/quest/domain/models/CombinedCourse.js';
import {
  COMBINED_COURSE_ITEM_TYPES,
  CombinedCourseItem,
} from '../../../../../src/quest/domain/models/CombinedCourseItem.js';
import { COMPARISONS as COMPARISONS_CRITERION } from '../../../../../src/quest/domain/models/CriterionProperty.js';
import {
  OrganizationLearnerParticipationStatuses,
  OrganizationLearnerParticipationTypes,
} from '../../../../../src/quest/domain/models/OrganizationLearnerParticipation.js';
import { REQUIREMENT_TYPES } from '../../../../../src/quest/domain/models/Quest.js';
import { COMPARISONS as COMPARISONS_REQUIREMENT } from '../../../../../src/quest/domain/models/Requirement.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { cryptoService } from '../../../../../src/shared/domain/services/crypto-service.js';
import { catchErr, databaseBuilder, expect, nock, sinon } from '../../../../test-helper.js';

describe('Integration | Quest | Domain | UseCases | get-combined-course-by-code', function () {
  let combinedCourseUrl, code;

  beforeEach(function () {
    code = 'SOMETHING';
    combinedCourseUrl = '/parcours/' + code;

    sinon.stub(cryptoService, 'encrypt');
    cryptoService.encrypt.withArgs(combinedCourseUrl).resolves('encryptedUrl');
  });

  it('should throw an error if CombinedCourse does not exist', async function () {
    const code = 'NOTHINGTT';

    const error = await catchErr(usecases.getCombinedCourseByCode)({ code });

    expect(error).to.be.instanceOf(NotFoundError);
  });
  describe('when there is a combined course participation', function () {
    it('should return CombinedCourse for provided code', async function () {
      nock('https://assets.pix.org').persist().head(/^.+$/).reply(200, {});
      const { id: organizationLearnerId, userId, organizationId } = databaseBuilder.factory.buildOrganizationLearner();
      const targetProfile = databaseBuilder.factory.buildTargetProfile({ ownerOrganizationId: organizationId });
      const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id, organizationId });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        userId,
        organizationLearnerId,
        status: CampaignParticipationStatuses.STARTED,
      });
      databaseBuilder.factory.buildTraining({ type: 'modulix', link: '/modules/bac-a-sable' });
      databaseBuilder.factory.buildTraining({ type: 'modulix', link: '/modules/bases-clavier-1' });
      const moduleId1 = '6282925d-4775-4bca-b513-4c3009ec5886';
      const moduleId2 = '654c44dc-0560-4acc-9860-4a67c923577f';

      const { id: combinedCourseId } = databaseBuilder.factory.buildCombinedCourse({
        code,
        organizationId,
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            comparison: COMPARISONS_REQUIREMENT.ALL,
            data: {
              campaignId: {
                data: campaign.id,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
              status: {
                data: CampaignParticipationStatuses.SHARED,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
            },
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
            comparison: COMPARISONS_REQUIREMENT.ALL,
            data: {
              moduleId: {
                data: moduleId1,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
              isTerminated: {
                data: true,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
            },
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
            comparison: COMPARISONS_REQUIREMENT.ALL,
            data: {
              moduleId: {
                data: moduleId2,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
              isTerminated: {
                data: true,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
            },
          },
        ],
      });

      await databaseBuilder.commit();

      const result = await usecases.getCombinedCourseByCode({ code, userId });

      expect(result).to.be.instanceOf(CombinedCourse);
      expect(result.items).to.be.deep.equal([
        {
          id: campaign.id,
          reference: campaign.code,
          title: campaign.title,
          type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
          masteryRate: null,
          redirection: undefined,
          isCompleted: false,
          isLocked: false,
          duration: undefined,
          image: undefined,
          validatedStagesCount: null,
          totalStagesCount: null,
        },
        {
          id: moduleId1,
          reference: 'bac-a-sable',
          title: 'Bac à sable',
          type: COMBINED_COURSE_ITEM_TYPES.MODULE,
          masteryRate: null,
          redirection: 'encryptedUrl',
          isCompleted: false,
          isLocked: true,
          duration: 5,
          image: 'https://assets.pix.org/modules/placeholder-details.svg',
          validatedStagesCount: null,
          totalStagesCount: null,
        },
        {
          id: moduleId2,
          reference: 'bases-clavier-1',
          title: 'Les bases du clavier sur ordinateur 1/2',
          type: COMBINED_COURSE_ITEM_TYPES.MODULE,
          masteryRate: null,
          redirection: 'encryptedUrl',
          isCompleted: false,
          isLocked: true,
          duration: 10,
          image: 'https://assets.pix.org/modules/placeholder-details.svg',
          validatedStagesCount: null,
          totalStagesCount: null,
        },
      ]);
      expect(result.id).to.equal(combinedCourseId);
      expect(result.status).to.equal(OrganizationLearnerParticipationStatuses.NOT_STARTED);
      expect(result.items[0]).instanceOf(CombinedCourseItem);
      expect(result.items[1]).instanceOf(CombinedCourseItem);
      expect(result.items[2]).instanceOf(CombinedCourseItem);
    });

    it('should return started combined course for given userId', async function () {
      nock('https://assets.pix.org').persist().head(/^.+$/).reply(200, {});
      const { id: organizationLearnerId, userId, organizationId } = databaseBuilder.factory.buildOrganizationLearner();
      const targetProfile = databaseBuilder.factory.buildTargetProfile({ ownerOrganizationId: organizationId });
      const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id, organizationId });
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        userId,
        organizationLearnerId,
        status: CampaignParticipationStatuses.SHARED,
        masteryRate: 0.5,
      });
      const training1 = databaseBuilder.factory.buildTraining({ type: 'modulix', link: '/modules/bac-a-sable' });
      const training2 = databaseBuilder.factory.buildTraining({ type: 'modulix', link: '/modules/bases-clavier-1' });
      databaseBuilder.factory.buildTraining({
        type: 'modulix',
        link: '/modules/bien-ecrire-son-adresse-mail',
      });
      const moduleId1 = '6282925d-4775-4bca-b513-4c3009ec5886';
      const moduleId2 = '654c44dc-0560-4acc-9860-4a67c923577f';
      const moduleId3 = 'f7b3a2e1-0d5c-4c6c-9c4d-1a3d8f7e9f5d';
      databaseBuilder.factory.buildTargetProfileTraining({
        targetProfileId: targetProfile.id,
        trainingId: training1.id,
      });
      databaseBuilder.factory.buildTargetProfileTraining({
        targetProfileId: targetProfile.id,
        trainingId: training2.id,
      });
      databaseBuilder.factory.buildUserRecommendedTraining({
        userId,
        trainingId: training1.id,
        campaignParticipationId: campaignParticipation.id,
      });
      databaseBuilder.factory.buildPassage({ moduleId: moduleId1, userId, terminatedAt: new Date() });

      const { id: combinedCourseId } = databaseBuilder.factory.buildCombinedCourse({
        code,
        organizationId,
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            comparison: COMPARISONS_REQUIREMENT.ALL,
            data: {
              campaignId: {
                data: campaign.id,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
              status: {
                data: CampaignParticipationStatuses.SHARED,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
            },
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
            comparison: COMPARISONS_REQUIREMENT.ALL,
            data: {
              moduleId: {
                data: moduleId1,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
              isTerminated: {
                data: true,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
            },
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
            comparison: COMPARISONS_REQUIREMENT.ALL,
            data: {
              moduleId: {
                data: moduleId2,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
              isTerminated: {
                data: true,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
            },
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
            comparison: COMPARISONS_REQUIREMENT.ALL,
            data: {
              moduleId: {
                data: moduleId3,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
              isTerminated: {
                data: true,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
            },
          },
        ],
      });

      databaseBuilder.factory.buildOrganizationLearnerParticipation({
        combinedCourseId,
        organizationLearnerId,
        status: OrganizationLearnerParticipationStatuses.STARTED,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      });

      await databaseBuilder.commit();

      const result = await usecases.getCombinedCourseByCode({ code, userId });

      expect(result.items).to.be.deep.equal([
        {
          id: campaign.id,
          reference: campaign.code,
          title: campaign.title,
          type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
          masteryRate: 0.5,
          validatedStagesCount: 0,
          totalStagesCount: 0,
          redirection: undefined,
          isCompleted: true,
          isLocked: false,
          duration: undefined,
          image: undefined,
        },
        {
          id: moduleId1,
          reference: 'bac-a-sable',
          title: 'Bac à sable',
          type: COMBINED_COURSE_ITEM_TYPES.MODULE,
          masteryRate: null,
          validatedStagesCount: null,
          totalStagesCount: null,
          redirection: 'encryptedUrl',
          isCompleted: true,
          isLocked: false,
          duration: 5,
          image: 'https://assets.pix.org/modules/placeholder-details.svg',
        },
        {
          id: moduleId3,
          reference: 'bien-ecrire-son-adresse-mail',
          title: 'Bien écrire une adresse mail',
          type: COMBINED_COURSE_ITEM_TYPES.MODULE,
          masteryRate: null,
          validatedStagesCount: null,
          totalStagesCount: null,
          redirection: 'encryptedUrl',
          isCompleted: false,
          isLocked: false,
          duration: 10,
          image: 'https://assets.pix.org/modules/bien-ecrire-son-adresse-mail-details.svg',
        },
      ]);
      expect(result).to.be.instanceOf(CombinedCourse);
      expect(result.id).to.equal(combinedCourseId);
      expect(result.status).to.equal(OrganizationLearnerParticipationStatuses.STARTED);
      expect(result.items[0]).instanceOf(CombinedCourseItem);
      expect(result.items[1]).instanceOf(CombinedCourseItem);
      expect(result.items[2]).instanceOf(CombinedCourseItem);
    });
  });
  describe('when there is no organization learner yet', function () {
    it('should return correct data for a not started combined course participation', async function () {
      nock('https://assets.pix.org').persist().head(/^.+$/).reply(200, {});

      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const targetProfile = databaseBuilder.factory.buildTargetProfile({ ownerOrganizationId: organizationId });
      const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id, organizationId });
      const userId = databaseBuilder.factory.buildUser().id;

      const training1 = databaseBuilder.factory.buildTraining({ type: 'modulix', link: '/modules/bac-a-sable' });
      const training2 = databaseBuilder.factory.buildTraining({ type: 'modulix', link: '/modules/bases-clavier-1' });
      databaseBuilder.factory.buildTraining({
        type: 'modulix',
        link: '/modules/bien-ecrire-son-adresse-mail',
      });
      const moduleId1 = '6282925d-4775-4bca-b513-4c3009ec5886';
      const moduleId2 = '654c44dc-0560-4acc-9860-4a67c923577f';
      const moduleId3 = 'f7b3a2e1-0d5c-4c6c-9c4d-1a3d8f7e9f5d';
      databaseBuilder.factory.buildTargetProfileTraining({
        targetProfileId: targetProfile.id,
        trainingId: training1.id,
      });
      databaseBuilder.factory.buildTargetProfileTraining({
        targetProfileId: targetProfile.id,
        trainingId: training2.id,
      });

      const { id: combinedCourseId } = databaseBuilder.factory.buildCombinedCourse({
        code,
        organizationId,
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            comparison: COMPARISONS_REQUIREMENT.ALL,
            data: {
              campaignId: {
                data: campaign.id,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
              status: {
                data: CampaignParticipationStatuses.SHARED,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
            },
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
            comparison: COMPARISONS_REQUIREMENT.ALL,
            data: {
              moduleId: {
                data: moduleId1,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
              isTerminated: {
                data: true,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
            },
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
            comparison: COMPARISONS_REQUIREMENT.ALL,
            data: {
              moduleId: {
                data: moduleId2,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
              isTerminated: {
                data: true,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
            },
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
            comparison: COMPARISONS_REQUIREMENT.ALL,
            data: {
              moduleId: {
                data: moduleId3,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
              isTerminated: {
                data: true,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
            },
          },
        ],
      });

      await databaseBuilder.commit();

      const result = await usecases.getCombinedCourseByCode({ code, userId });
      expect(result).to.be.instanceOf(CombinedCourse);
      expect(result.id).to.equal(combinedCourseId);
      expect(result.status).to.equal(OrganizationLearnerParticipationStatuses.NOT_STARTED);
      expect(result.items[0]).instanceOf(CombinedCourseItem);
      expect(result.items[1]).instanceOf(CombinedCourseItem);
      expect(result.items[2]).instanceOf(CombinedCourseItem);
    });
  });
});
