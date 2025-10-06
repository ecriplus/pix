import { CombinedCourseParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { CombinedCourseParticipation } from '../../../../../src/quest/domain/models/CombinedCourseParticipation.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Quest | Integration | Domain | Usecases | findCombinedCourseParticipations', function () {
  it('should return  CombinedCourseParticipations', async function () {
    // given
    const learner = databaseBuilder.factory.buildOrganizationLearner({ firstName: 'Paul', lastName: 'Azerty' });
    const questId = databaseBuilder.factory.buildQuestForCombinedCourse().id;
    const participation1 = databaseBuilder.factory.buildCombinedCourseParticipation({
      organizationLearnerId: learner.id,
      questId,
      status: CombinedCourseParticipationStatuses.COMPLETED,
    });
    const anotherquestId = databaseBuilder.factory.buildQuestForCombinedCourse().id;
    databaseBuilder.factory.buildCombinedCourseParticipation({
      organizationLearnerId: learner.id,
      questId: anotherquestId,
      status: CombinedCourseParticipationStatuses.COMPLETED,
    });

    await databaseBuilder.commit();

    // when
    const results = await usecases.findCombinedCourseParticipations({ questId });

    // then
    expect(results).lengthOf(1);
    expect(results[0]).instanceOf(CombinedCourseParticipation);
    expect(results).deep.equal([
      {
        id: participation1.id,
        firstName: learner.firstName,
        lastName: learner.lastName,
        status: CombinedCourseParticipationStatuses.COMPLETED,
        createdAt: participation1.createdAt,
        updatedAt: participation1.updatedAt,
        organizationLearnerId: learner.id,
        questId,
      },
    ]);
  });
});
