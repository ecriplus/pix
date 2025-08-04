import { CombinedCourseStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { CombinedCourse } from '../../../../../src/quest/domain/models/CombinedCourse.js';
import { CombinedCourseItem, ITEM_TYPE } from '../../../../../src/quest/domain/models/CombinedCourseItem.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Quest | Domain | UseCases | get-combined-course-by-code', function () {
  it('should return CombinedCourse for provided code', async function () {
    const code = 'SOMETHING';
    const { id: organizationLearnerId, userId, organizationId } = databaseBuilder.factory.buildOrganizationLearner();
    const targetProfile = databaseBuilder.factory.buildTargetProfile({ ownerOrganizationId: organizationId });
    const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id, organizationId });
    databaseBuilder.factory.buildCampaignParticipation({
      campaign,
      userId,
      organizationLearnerId,
      status: 'STARTED',
    });
    databaseBuilder.factory.buildTraining({ type: 'modulix', link: '/modules/bac-a-sable' });
    databaseBuilder.factory.buildTraining({ type: 'modulix', link: '/modules/bases-clavier-1' });
    const moduleId1 = '6282925d-4775-4bca-b513-4c3009ec5886';
    const moduleId2 = '654c44dc-0560-4acc-9860-4a67c923577f';

    const { id: questId } = databaseBuilder.factory.buildQuestForCombinedCourse({
      code,
      organizationId,
      successRequirements: [
        {
          requirement_type: 'campaignParticipations',
          comparison: 'all',
          data: {
            campaignId: {
              data: campaign.id,
              comparison: 'equal',
            },
          },
        },
        {
          requirement_type: 'passages',
          comparison: 'all',
          data: {
            moduleId: {
              data: moduleId1,
              comparison: 'equal',
            },
          },
        },
        {
          requirement_type: 'passages',
          comparison: 'all',
          data: {
            moduleId: {
              data: moduleId2,
              comparison: 'equal',
            },
          },
        },
      ],
    });

    await databaseBuilder.commit();

    const result = await usecases.getCombinedCourseByCode({ code, userId });

    expect(result).to.be.instanceOf(CombinedCourse);
    expect(result.items).to.be.deep.equal([
      new CombinedCourseItem({
        id: campaign.id,
        reference: campaign.code,
        title: campaign.name,
        type: ITEM_TYPE.CAMPAIGN,
      }),
      new CombinedCourseItem({
        id: moduleId1,
        reference: 'bac-a-sable',
        title: 'Bac à sable',
        type: ITEM_TYPE.MODULE,
      }),
      new CombinedCourseItem({
        id: moduleId2,
        reference: 'bases-clavier-1',
        title: 'Les bases du clavier sur ordinateur 1/2',
        type: ITEM_TYPE.MODULE,
      }),
    ]);
    expect(result.id).to.equal(questId);
    expect(result.status).to.equal(CombinedCourseStatuses.NOT_STARTED);
  });

  it('should return started combined course for given userId', async function () {
    const code = 'SOMETHING';
    const { id: organizationLearnerId, userId, organizationId } = databaseBuilder.factory.buildOrganizationLearner();
    const targetProfile = databaseBuilder.factory.buildTargetProfile({ ownerOrganizationId: organizationId });
    const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id, organizationId });
    const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
      campaignId: campaign.id,
      userId,
      organizationLearnerId,
      status: 'SHARED',
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
    databaseBuilder.factory.buildTargetProfileTraining({ targetProfileId: targetProfile.id, trainingId: training1.id });
    databaseBuilder.factory.buildTargetProfileTraining({ targetProfileId: targetProfile.id, trainingId: training2.id });
    databaseBuilder.factory.buildUserRecommendedTraining({
      userId,
      trainingId: training1.id,
      campaignParticipationId: campaignParticipation.id,
    });

    const { id: questId } = databaseBuilder.factory.buildQuestForCombinedCourse({
      code,
      organizationId,
      successRequirements: [
        {
          requirement_type: 'campaignParticipations',
          comparison: 'all',
          data: {
            campaignId: {
              data: campaign.id,
              comparison: 'equal',
            },
          },
        },
        {
          requirement_type: 'passages',
          comparison: 'all',
          data: {
            moduleId: {
              data: moduleId1,
              comparison: 'equal',
            },
          },
        },
        {
          requirement_type: 'passages',
          comparison: 'all',
          data: {
            moduleId: {
              data: moduleId2,
              comparison: 'equal',
            },
          },
        },
        {
          requirement_type: 'passages',
          comparison: 'all',
          data: {
            moduleId: {
              data: moduleId3,
              comparison: 'equal',
            },
          },
        },
      ],
    });

    databaseBuilder.factory.buildCombinedCourseParticipation({ questId, organizationLearnerId });

    await databaseBuilder.commit();

    const result = await usecases.getCombinedCourseByCode({ code, userId });

    expect(result.items).to.be.deep.equal([
      new CombinedCourseItem({
        id: campaign.id,
        reference: campaign.code,
        title: campaign.name,
        type: ITEM_TYPE.CAMPAIGN,
      }),
      new CombinedCourseItem({
        id: moduleId1,
        reference: 'bac-a-sable',
        title: 'Bac à sable',
        type: ITEM_TYPE.MODULE,
      }),
      new CombinedCourseItem({
        id: moduleId3,
        reference: 'bien-ecrire-son-adresse-mail',
        title: 'Bien écrire une adresse mail',
        type: ITEM_TYPE.MODULE,
      }),
    ]);
    expect(result).to.be.instanceOf(CombinedCourse);
    expect(result.id).to.equal(questId);
    expect(result.status).to.equal(CombinedCourseStatuses.STARTED);
  });

  it('should throw an error if CombinedCourse does not exist', async function () {
    const code = 'NOTHINGTT';

    const error = await catchErr(usecases.getCombinedCourseByCode)({ code });

    expect(error).to.be.instanceOf(NotFoundError);
  });
});
