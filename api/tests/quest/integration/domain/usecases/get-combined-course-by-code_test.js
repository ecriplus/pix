import { CombinedCourseStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { CombinedCourse } from '../../../../../src/quest/domain/models/CombinedCourse.js';
import { CombinedCourseItem, ITEM_TYPE } from '../../../../../src/quest/domain/models/CombinedCourseItem.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Quest | Domain | UseCases | get-combined-course-by-code', function () {
  it('should return CombinedCourse for provided code', async function () {
    const code = 'SOMETHING';
    const campaign = databaseBuilder.factory.buildCampaign();
    const moduleId = '6282925d-4775-4bca-b513-4c3009ec5886';
    const { id: questId } = databaseBuilder.factory.buildQuestForCombinedCourse({
      code,
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
    const userId = databaseBuilder.factory.buildUser().id;
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
        id: moduleId,
        reference: 'bac-a-sable',
        title: 'Bac à sable',
        type: ITEM_TYPE.MODULE,
      }),
    ]);
    expect(result.id).to.equal(questId);
    expect(result.status).to.equal(CombinedCourseStatuses.NOT_STARTED);
  });

  it('should return started combined course for given userId', async function () {
    const code = 'SOMETHING';
    const campaign = databaseBuilder.factory.buildCampaign();
    const { id: questId, organizationId } = databaseBuilder.factory.buildQuestForCombinedCourse({
      code,
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
    const userId = databaseBuilder.factory.buildUser().id;
    const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ userId, organizationId }).id;
    databaseBuilder.factory.buildCombinedCourseParticipation({ questId, organizationLearnerId });
    await databaseBuilder.commit();

    const result = await usecases.getCombinedCourseByCode({ code, userId });

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
