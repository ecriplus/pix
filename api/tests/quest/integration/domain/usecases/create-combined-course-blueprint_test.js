import { CampaignParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { CombinedCourseBlueprint } from '../../../../../src/quest/domain/models/CombinedCourseBlueprint.js';
import {
  CRITERION_COMPARISONS,
  Quest,
  REQUIREMENT_COMPARISONS,
  REQUIREMENT_TYPES,
} from '../../../../../src/quest/domain/models/Quest.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Combined course | Domain | UseCases | create-combined-course-blueprint', function () {
  it('should create a combined course blueprint with quest', async function () {
    // given
    const moduleShortId = '6a68bf32';
    const moduleId = '6282925d-4775-4bca-b513-4c3009ec5886';
    const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
    await databaseBuilder.commit();

    const expectedQuest = new Quest({
      eligibilityRequirements: [],
      successRequirements: [
        {
          comparison: REQUIREMENT_COMPARISONS.ALL,
          requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
          data: {
            isTerminated: { comparison: CRITERION_COMPARISONS.EQUAL, data: true },
            moduleId: {
              comparison: CRITERION_COMPARISONS.EQUAL,
              data: moduleId,
            },
          },
        },
        {
          comparison: REQUIREMENT_COMPARISONS.ALL,
          data: {
            status: {
              comparison: CRITERION_COMPARISONS.EQUAL,
              data: CampaignParticipationStatuses.SHARED,
            },
            targetProfileId: {
              comparison: CRITERION_COMPARISONS.EQUAL,
              data: targetProfileId,
            },
          },
          requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
        },
      ],
    });

    const combinedCourseBlueprint = new CombinedCourseBlueprint({
      name: 'Mon épure',
      internalName: 'Une épure pour tel niveau',
      illustration: 'illustrations/mon-epure.png',
      description: 'Description',
      content: CombinedCourseBlueprint.buildContentItems([{ moduleShortId }, { targetProfileId }]),
    });

    const result = await usecases.createCombinedCourseBlueprint({ combinedCourseBlueprint });

    expect(result.name).to.equal(combinedCourseBlueprint.name);
    expect(result.internalName).to.equal(combinedCourseBlueprint.internalName);
    expect(result.illustration).to.equal(combinedCourseBlueprint.illustration);
    expect(result.content).to.deep.equal(combinedCourseBlueprint.content);
    expect(result.description).to.equal(combinedCourseBlueprint.description);
    expect(result.quest.toDTO().successRequirements).deep.equal(expectedQuest.toDTO().successRequirements);
    expect(result.quest.toDTO().rewardId).to.be.null;
    expect(result.quest.toDTO().rewardType).to.be.null;
  });

  it('should return error if a targetProfileId in content is not found', async function () {
    // given
    const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
    await databaseBuilder.commit();

    const combinedCourseBlueprint = new CombinedCourseBlueprint({
      name: 'Mon épure',
      internalName: 'Une épure pour tel niveau',
      illustration: 'illustrations/mon-epure.png',
      description: 'Description',
      content: CombinedCourseBlueprint.buildContentItems([{ targetProfileId }, { targetProfileId: 123 }]),
    });

    const error = await catchErr(usecases.createCombinedCourseBlueprint)({ combinedCourseBlueprint });
    expect(error).to.be.instanceOf(NotFoundError);
  });

  it('should return error if one of the modules in content is not found', async function () {
    // given
    const combinedCourseBlueprint = new CombinedCourseBlueprint({
      name: 'Mon épure',
      internalName: 'Une épure pour tel niveau',
      illustration: 'illustrations/mon-epure.png',
      description: 'Description',
      content: CombinedCourseBlueprint.buildContentItems([{ moduleShortId: '6a68bf32' }, { moduleShortId: 'abc-123' }]),
    });

    const error = await catchErr(usecases.createCombinedCourseBlueprint)({ combinedCourseBlueprint });
    expect(error).to.be.instanceOf(NotFoundError);
  });
});
