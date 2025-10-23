import { CombinedCourseParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { CombinedCourseParticipationDetails } from '../../../../../src/quest/domain/models/CombinedCourseParticipationDetails.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Quest | Integration | Domain | Usecases | findCombinedCourseParticipations', function () {
  it('should return CombinedCourseParticipationDetails', async function () {
    // given
    const { id: campaignId, organizationId } = databaseBuilder.factory.buildCampaign();
    const { questId, id: combinedCourseId } = databaseBuilder.factory.buildCombinedCourse({
      code: 'COMBI1',
      organizationId: organizationId,
      successRequirements: [
        {
          requirement_type: 'campaignParticipations',
          comparison: 'all',
          data: {
            campaignId: {
              data: campaignId,
              comparison: 'equal',
            },
            status: {
              data: 'SHARED',
              comparison: 'equal',
            },
          },
        },
        {
          requirement_type: 'passages',
          comparison: 'all',
          data: {
            moduleId: {
              data: 'eeeb4951-6f38-4467-a4ba-0c85ed71321a',
              comparison: 'equal',
            },
            isTerminated: {
              data: true,
              comparison: 'equal',
            },
          },
        },
      ],
    });
    const learner = databaseBuilder.factory.buildOrganizationLearner({
      firstName: 'Paul',
      lastName: 'Azerty',
      organizationId,
    });
    databaseBuilder.factory.buildCampaignParticipation({
      campaignId,
      organizationLearnerId: learner.id,
      userId: learner.userId,
    });
    const participation1 = databaseBuilder.factory.buildCombinedCourseParticipation({
      organizationLearnerId: learner.id,
      questId,
      combinedCourseId,
      status: CombinedCourseParticipationStatuses.STARTED,
    });
    const { questId: anotherquestId, id: anotherCombinedCourseId } = databaseBuilder.factory.buildCombinedCourse({
      code: 'COMBI2',
    });
    databaseBuilder.factory.buildCombinedCourseParticipation({
      organizationLearnerId: learner.id,
      questId: anotherquestId,
      combinedCourseId: anotherCombinedCourseId,
      status: CombinedCourseParticipationStatuses.COMPLETED,
    });

    await databaseBuilder.commit();

    // when
    const { combinedCourseParticipations } = await usecases.findCombinedCourseParticipations({
      combinedCourseId,
    });

    // then
    expect(combinedCourseParticipations).lengthOf(1);
    expect(combinedCourseParticipations[0]).instanceOf(CombinedCourseParticipationDetails);
    expect(combinedCourseParticipations).deep.equal([
      {
        id: participation1.id,
        firstName: learner.firstName,
        lastName: learner.lastName,
        status: CombinedCourseParticipationStatuses.STARTED,
        createdAt: participation1.createdAt,
        updatedAt: participation1.updatedAt,
        hasFormationItem: false,
        nbModules: 1,
        nbModulesCompleted: 0,
        nbCampaigns: 1,
        nbCampaignsCompleted: 1,
      },
    ]);
  });
  it('should return a paginated list of combinedCourseParticipation', async function () {
    // given
    const { id: campaignId, organizationId } = databaseBuilder.factory.buildCampaign();
    const { questId, id: combinedCourseId } = databaseBuilder.factory.buildCombinedCourse({
      code: 'COMBI1',
      organizationId,
      successRequirements: [
        {
          requirement_type: 'campaignParticipations',
          comparison: 'all',
          data: {
            campaignId: {
              data: campaignId,
              comparison: 'equal',
            },
            status: {
              data: 'SHARED',
              comparison: 'equal',
            },
          },
        },
        {
          requirement_type: 'passages',
          comparison: 'all',
          data: {
            moduleId: {
              data: 'eeeb4951-6f38-4467-a4ba-0c85ed71321a',
              comparison: 'equal',
            },
            isTerminated: {
              data: true,
              comparison: 'equal',
            },
          },
        },
      ],
    });
    const learner = databaseBuilder.factory.buildOrganizationLearner({
      firstName: 'Paul',
      lastName: 'Azerty',
      organizationId,
    });
    databaseBuilder.factory.buildCombinedCourseParticipation({
      organizationLearnerId: learner.id,
      questId,
      combinedCourseId,
      status: CombinedCourseParticipationStatuses.COMPLETED,
    });
    const anotherLearner = databaseBuilder.factory.buildOrganizationLearner({
      firstName: 'Marianne',
      lastName: 'Klee',
      organizationId,
    });
    const anotherParticipation = databaseBuilder.factory.buildCombinedCourseParticipation({
      organizationLearnerId: anotherLearner.id,
      questId,
      combinedCourseId,
      status: CombinedCourseParticipationStatuses.COMPLETED,
    });
    databaseBuilder.factory.buildCampaignParticipation({
      campaignId,
      organizationLearnerId: anotherLearner.id,
      userId: anotherLearner.userId,
    });
    databaseBuilder.factory.buildPassage({
      moduleId: 'eeeb4951-6f38-4467-a4ba-0c85ed71321a',
      userId: anotherLearner.userId,
      terminatedAt: new Date('2025-10-12'),
    });
    const { questId: anotherquestId, id: anotherCombinedCourseId } = databaseBuilder.factory.buildCombinedCourse({
      code: 'COMBI2',
    });
    databaseBuilder.factory.buildCombinedCourseParticipation({
      organizationLearnerId: learner.id,
      questId: anotherquestId,
      combinedCourseId: anotherCombinedCourseId,
      status: CombinedCourseParticipationStatuses.COMPLETED,
    });

    await databaseBuilder.commit();

    // when
    const { combinedCourseParticipations, meta } = await usecases.findCombinedCourseParticipations({
      combinedCourseId,
      page: { size: 1, number: 2 },
    });

    // then
    expect(meta).deep.equal({ page: 2, pageSize: 1, rowCount: 2, pageCount: 2 });
    expect(combinedCourseParticipations).lengthOf(1);
    expect(combinedCourseParticipations[0]).instanceOf(CombinedCourseParticipationDetails);
    expect(combinedCourseParticipations).deep.equal([
      {
        id: anotherParticipation.id,
        firstName: anotherLearner.firstName,
        lastName: anotherLearner.lastName,
        status: CombinedCourseParticipationStatuses.COMPLETED,
        createdAt: anotherParticipation.createdAt,
        updatedAt: anotherParticipation.updatedAt,
        hasFormationItem: false,
        nbModules: 1,
        nbModulesCompleted: 1,
        nbCampaigns: 1,
        nbCampaignsCompleted: 1,
      },
    ]);
  });
});
