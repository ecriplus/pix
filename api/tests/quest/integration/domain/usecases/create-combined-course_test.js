import { CampaignParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import {
  CRITERION_COMPARISONS,
  REQUIREMENT_COMPARISONS,
  REQUIREMENT_TYPES,
} from '../../../../../src/quest/domain/models/Quest.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { databaseBuilder, expect, knex } from '../../../../test-helper.js';

describe('Integration | Combined course | Domain | UseCases | create-combined-course', function () {
  it('should create combined course for given payload', async function () {
    // given
    const userId = databaseBuilder.factory.buildUser().id;
    const organizationId = databaseBuilder.factory.buildOrganization().id;

    const targetProfileWithTraining = databaseBuilder.factory.buildTargetProfile();
    const otherTargetProfile = databaseBuilder.factory.buildTargetProfile();

    const trainingId = databaseBuilder.factory.buildTraining({
      type: 'modulix',
      title: 'Demo combinix 1',
      link: '/modules/demo-combinix-1',
      locale: 'fr-fr',
    }).id;

    databaseBuilder.factory.buildTargetProfileTraining({
      targetProfileId: targetProfileWithTraining.id,
      trainingId: trainingId,
    });

    const {
      id: combinedCourseBlueprintId,
      description,
      illustration,
    } = databaseBuilder.factory.buildCombinedCourseBlueprint({
      content: [
        { type: 'evaluation', value: targetProfileWithTraining.id },
        { type: 'module', value: '27d6ca4f' },
        { type: 'module', value: 'df82ec66' },
        { type: 'evaluation', value: otherTargetProfile.id },
      ],
    });

    await databaseBuilder.commit();

    const nameInput = 'Un parcours combiné';

    // when
    await usecases.createCombinedCourse({
      name: nameInput,
      combinedCourseBlueprintId,
      creatorId: userId,
      organizationId,
    });

    const campaigns = await knex('campaigns')
      .where({ organizationId })
      .whereIn('targetProfileId', [otherTargetProfile.id, targetProfileWithTraining.id])
      .orderBy('id');

    const expectedModules = [
      {
        requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
        comparison: CRITERION_COMPARISONS.ALL,
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
      {
        requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
        comparison: CRITERION_COMPARISONS.ALL,
        data: {
          moduleId: {
            data: 'f32a2238-4f65-4698-b486-15d51935d335',
            comparison: CRITERION_COMPARISONS.EQUAL,
          },
          isTerminated: {
            data: true,
            comparison: CRITERION_COMPARISONS.EQUAL,
          },
        },
      },
    ];

    const expectedCreatedQuest = {
      name: nameInput,
      rewardType: null,
      rewardId: null,
      organizationId,
      eligibilityRequirements: [],
      successRequirements: [
        {
          requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
          comparison: REQUIREMENT_COMPARISONS.ALL,
          data: {
            campaignId: {
              data: campaigns[0].id,
              comparison: CRITERION_COMPARISONS.EQUAL,
            },
            status: {
              data: CampaignParticipationStatuses.SHARED,
              comparison: CRITERION_COMPARISONS.EQUAL,
            },
          },
        },
        ...expectedModules,
        {
          requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
          comparison: REQUIREMENT_COMPARISONS.ALL,
          data: {
            campaignId: {
              data: campaigns[1].id,
              comparison: CRITERION_COMPARISONS.EQUAL,
            },
            status: {
              data: CampaignParticipationStatuses.SHARED,
              comparison: CRITERION_COMPARISONS.EQUAL,
            },
          },
        },
      ],
      description,
      illustration,
    };

    // then
    const [createdQuest] = await knex('quests')
      .join('combined_courses', 'combined_courses.questId', 'quests.id')
      .where('combined_courses.organizationId', organizationId)
      .orderBy('quests.id');

    // Quest
    expect(createdQuest.combinedCourseBlueprintId).to.equal(combinedCourseBlueprintId);
    expect(createdQuest.code).not.to.be.null;
    expect(createdQuest.name).to.equal(nameInput);
    expect(createdQuest.successRequirements).to.deep.equal(createdQuest.successRequirements);
    expect(createdQuest.description).to.equal(expectedCreatedQuest.description);
    expect(createdQuest.illustration).to.equal(expectedCreatedQuest.illustration);

    //Campaign 1
    expect(campaigns[0].name).to.equal(targetProfileWithTraining.internalName);
    expect(campaigns[0].title).to.equal(targetProfileWithTraining.name);
    expect(campaigns[0].customResultPageButtonUrl.includes('/chargement')).true;
    expect(campaigns[0].customResultPageButtonText).to.equal('Continuer');

    expect(campaigns[1].name).to.equal(otherTargetProfile.internalName);
    expect(campaigns[1].title).to.equal(otherTargetProfile.name);
    expect(campaigns[1].customResultPageButtonUrl.includes('/chargement')).false;
    expect(campaigns[1].customResultPageButtonText).to.equal('Continuer');
  });
});
