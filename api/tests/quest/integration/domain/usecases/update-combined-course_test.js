import {
  CombinedCourseParticipationStatuses,
  CombinedCourseStatuses,
} from '../../../../../src/prescription/shared/domain/constants.js';
import { CombinedCourseParticipation } from '../../../../../src/quest/domain/models/CombinedCourseParticipation.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { databaseBuilder, expect, knex, sinon } from '../../../../test-helper.js';

describe('Integration | Quest | Domain | UseCases | update-combined-course', function () {
  let clock;
  const now = new Date('2025-07-07');

  beforeEach(function () {
    clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
  });

  afterEach(function () {
    clock.restore();
  });
  it('should update combined course if it is completed', async function () {
    const code = 'SOMETHING';
    const moduleId = '6282925d-4775-4bca-b513-4c3009ec5886';
    const { id: organizationLearnerId, userId, organizationId } = databaseBuilder.factory.buildOrganizationLearner();
    const trainingId = databaseBuilder.factory.buildTraining({ type: 'modulix', link: '/modules/bac-a-sable' }).id;
    const targetProfile = databaseBuilder.factory.buildTargetProfile({ ownerOrganizationId: organizationId });
    databaseBuilder.factory.buildTargetProfileTraining({ targetProfileId: targetProfile.id, trainingId });

    const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id, organizationId });
    const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
      campaignId: campaign.id,
      userId,
      organizationLearnerId,
      status: 'SHARED',
    }).id;
    databaseBuilder.factory.buildUserRecommendedTraining({
      userId,
      trainingId: trainingId,
      campaignParticipationId,
    });
    databaseBuilder.factory.buildPassage({ userId, moduleId, terminatedAt: new Date() });
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
              data: moduleId,
              comparison: 'equal',
            },
          },
        },
      ],
    });
    databaseBuilder.factory.buildCombinedCourseParticipation({
      organizationLearnerId,
      questId,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2022-01-01'),
      status: CombinedCourseParticipationStatuses.STARTED,
    });
    await databaseBuilder.commit();

    const result = await usecases.updateCombinedCourse({ userId, code });

    expect(result).to.be.instanceOf(CombinedCourseParticipation);
    expect(result.status).to.equal(CombinedCourseStatuses.COMPLETED);
    expect(result.updatedAt).to.deep.equal(now);
  });

  it('should not update combined course if it not completed', async function () {
    const code = 'SOMETHING';
    const { id: organizationLearnerId, userId, organizationId } = databaseBuilder.factory.buildOrganizationLearner();
    const targetProfile = databaseBuilder.factory.buildTargetProfile({ ownerOrganizationId: organizationId });
    const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id, organizationId });

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
      ],
    });
    const combinedCourseParticipation = databaseBuilder.factory.buildCombinedCourseParticipation({
      organizationLearnerId,
      questId,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2022-01-01'),
      status: CombinedCourseParticipationStatuses.STARTED,
    });
    await databaseBuilder.commit();

    const result = await usecases.updateCombinedCourse({ userId, code });

    expect(result).to.be.instanceOf(CombinedCourseParticipation);
    expect(result.status).to.equal(CombinedCourseStatuses.STARTED);
    expect(result.updatedAt).to.deep.equal(combinedCourseParticipation.createdAt);
  });

  it('should not throw if combinedCourseParticipation does not exists', async function () {
    const code = 'SOMETHING';
    const { userId, organizationId } = databaseBuilder.factory.buildOrganizationLearner();
    const targetProfile = databaseBuilder.factory.buildTargetProfile({ ownerOrganizationId: organizationId });
    const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id, organizationId });

    databaseBuilder.factory.buildQuestForCombinedCourse({
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
      ],
    });
    await databaseBuilder.commit();

    const result = await usecases.updateCombinedCourse({ userId, code });

    expect(result).to.not.throw;
  });

  it('should not update combined course if it is already completed', async function () {
    const code = 'SOMETHING';
    const { id: organizationLearnerId, userId, organizationId } = databaseBuilder.factory.buildOrganizationLearner();
    const targetProfile = databaseBuilder.factory.buildTargetProfile({ ownerOrganizationId: organizationId });
    const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id, organizationId });

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
      ],
    });
    const combinedCourseParticipation = databaseBuilder.factory.buildCombinedCourseParticipation({
      organizationLearnerId,
      questId,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2022-01-01'),
      status: CombinedCourseParticipationStatuses.COMPLETED,
    });
    await databaseBuilder.commit();

    await usecases.updateCombinedCourse({ userId, code });

    const result = await knex('combined_course_participations').where({ id: combinedCourseParticipation.id }).first();

    expect(result.status).to.equal(combinedCourseParticipation.status);
    expect(result.updatedAt).to.deep.equal(combinedCourseParticipation.updatedAt);
  });
});
