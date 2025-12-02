import {
  CampaignParticipationStatuses,
  CombinedCourseParticipationStatuses,
} from '../../../../../src/prescription/shared/domain/constants.js';
import { CombinedCourseParticipationDetails } from '../../../../../src/quest/domain/models/CombinedCourseParticipationDetails.js';
import { OrganizationLearnerParticipationStatuses } from '../../../../../src/quest/domain/models/OrganizationLearnerParticipation.js';
import {
  CRITERION_COMPARISONS,
  REQUIREMENT_COMPARISONS,
  REQUIREMENT_TYPES,
} from '../../../../../src/quest/domain/models/Quest.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Quest | Integration | Domain | Usecases | findCombinedCourseParticipations', function () {
  let combinedCourseId, participation1, participation2, learner1, learner2;

  beforeEach(async function () {
    const { id: campaignId, organizationId } = databaseBuilder.factory.buildCampaign();
    const combinedCourse = databaseBuilder.factory.buildCombinedCourse({
      code: 'COMBI1',
      organizationId,
      successRequirements: [
        {
          requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
          comparison: REQUIREMENT_COMPARISONS.ALL,
          data: {
            campaignId: {
              data: campaignId,
              comparison: CRITERION_COMPARISONS.EQUAL,
            },
            status: {
              data: CampaignParticipationStatuses.SHARED,
              comparison: CRITERION_COMPARISONS.EQUAL,
            },
          },
        },
        {
          requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
          comparison: REQUIREMENT_COMPARISONS.ALL,
          data: {
            moduleId: {
              data: 'eeeb4951-6f38-4467-a4ba-0c85ed71321a',
              comparison: CRITERION_COMPARISONS.EQUAL,
            },
            isTerminated: {
              data: true,
              comparison: CRITERION_COMPARISONS.EQUAL,
            },
          },
        },
      ],
    });
    combinedCourseId = combinedCourse.id;

    learner1 = databaseBuilder.factory.buildOrganizationLearner({
      firstName: 'Paul',
      lastName: 'Azerty',
      division: '6eme A',
      group: 'Groupe 1',
      organizationId,
    });
    participation1 = databaseBuilder.factory.buildOrganizationLearnerParticipation.ofTypeCombinedCourse({
      organizationLearnerId: learner1.id,
      combinedCourseId,
      status: CombinedCourseParticipationStatuses.STARTED,
    });
    learner2 = databaseBuilder.factory.buildOrganizationLearner({
      firstName: 'Marianne',
      lastName: 'Klee',
      division: '5eme B',
      group: 'Groupe 2',
      organizationId,
    });
    participation2 = databaseBuilder.factory.buildOrganizationLearnerParticipation.ofTypeCombinedCourse({
      organizationLearnerId: learner2.id,
      combinedCourseId,
      status: OrganizationLearnerParticipationStatuses.COMPLETED,
    });
    databaseBuilder.factory.buildCampaignParticipation({
      campaignId,
      organizationLearnerId: learner2.id,
      userId: learner2.userId,
    });
    databaseBuilder.factory.buildOrganizationLearnerParticipation.ofTypePassage({
      moduleId: 'eeeb4951-6f38-4467-a4ba-0c85ed71321a',
      organizationLearnerId: learner2.id,
      status: OrganizationLearnerParticipationStatuses.COMPLETED,
    });

    const { id: anotherCombinedCourseId } = databaseBuilder.factory.buildCombinedCourse({
      code: 'COMBI2',
    });
    databaseBuilder.factory.buildOrganizationLearnerParticipation.ofTypeCombinedCourse({
      organizationLearnerId: learner1.id,
      combinedCourseId: anotherCombinedCourseId,
      status: OrganizationLearnerParticipationStatuses.COMPLETED,
    });

    await databaseBuilder.commit();
  });

  it('should return participations with details from a combined course', async function () {
    // when
    const { combinedCourseParticipations } = await usecases.findCombinedCourseParticipations({
      combinedCourseId,
    });

    // then
    expect(combinedCourseParticipations).lengthOf(2);
    expect(combinedCourseParticipations[0]).instanceOf(CombinedCourseParticipationDetails);
    expect(combinedCourseParticipations).deep.equal([
      {
        id: participation1.id,
        firstName: learner1.firstName,
        lastName: learner1.lastName,
        division: learner1.division,
        group: learner1.group,
        status: CombinedCourseParticipationStatuses.STARTED,
        createdAt: participation1.createdAt,
        updatedAt: participation1.updatedAt,
        hasFormationItem: false,
        nbModules: 1,
        nbModulesCompleted: 0,
        nbCampaigns: 1,
        nbCampaignsCompleted: 0,
      },
      {
        id: participation2.id,
        firstName: learner2.firstName,
        lastName: learner2.lastName,
        division: learner2.division,
        group: learner2.group,
        status: CombinedCourseParticipationStatuses.COMPLETED,
        createdAt: participation2.createdAt,
        updatedAt: participation2.updatedAt,
        hasFormationItem: false,
        nbModules: 1,
        nbModulesCompleted: 1,
        nbCampaigns: 1,
        nbCampaignsCompleted: 1,
      },
    ]);
  });

  it('should return a paginated list of participations with details', async function () {
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
        id: participation2.id,
        firstName: learner2.firstName,
        lastName: learner2.lastName,
        division: learner2.division,
        group: learner2.group,
        status: CombinedCourseParticipationStatuses.COMPLETED,
        createdAt: participation2.createdAt,
        updatedAt: participation2.updatedAt,
        hasFormationItem: false,
        nbModules: 1,
        nbModulesCompleted: 1,
        nbCampaigns: 1,
        nbCampaignsCompleted: 1,
      },
    ]);
  });

  it('should return a list on participations filtered by fullname', async function () {
    // when
    const { combinedCourseParticipations } = await usecases.findCombinedCourseParticipations({
      combinedCourseId,
      filters: { fullName: 'mar' },
    });

    // then
    expect(combinedCourseParticipations).lengthOf(1);
    expect(combinedCourseParticipations[0].id).equal(participation2.id);
  });

  it('should return a list on participations filtered by status', async function () {
    // when
    const { combinedCourseParticipations } = await usecases.findCombinedCourseParticipations({
      combinedCourseId,
      filters: { statuses: [CombinedCourseParticipationStatuses.STARTED] },
    });

    // then
    expect(combinedCourseParticipations).lengthOf(1);
    expect(combinedCourseParticipations[0].id).equal(participation1.id);
  });

  it('should return a list on participations filtered by division', async function () {
    // when
    const { combinedCourseParticipations } = await usecases.findCombinedCourseParticipations({
      combinedCourseId,
      filters: { divisions: ['6eme A'] },
    });

    // then
    expect(combinedCourseParticipations).lengthOf(1);
    expect(combinedCourseParticipations[0].id).equal(participation1.id);
  });

  it('should return a list on participations filtered by group', async function () {
    // when
    const { combinedCourseParticipations } = await usecases.findCombinedCourseParticipations({
      combinedCourseId,
      filters: { groups: ['Groupe 2'] },
    });

    // then
    expect(combinedCourseParticipations).lengthOf(1);
    expect(combinedCourseParticipations[0].id).equal(participation2.id);
  });
});
