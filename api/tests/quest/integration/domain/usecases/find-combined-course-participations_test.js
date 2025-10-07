import { CombinedCourseParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { CombinedCourseParticipation } from '../../../../../src/quest/domain/models/CombinedCourseParticipation.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Quest | Integration | Domain | Usecases | findCombinedCourseParticipations', function () {
  it('should return  CombinedCourseParticipations', async function () {
    // given
    const {
      questId,
      organizationId,
      id: combinedCourseId,
    } = databaseBuilder.factory.buildCombinedCourse({ code: 'COMBI1' });
    const learner = databaseBuilder.factory.buildOrganizationLearner({
      firstName: 'Paul',
      lastName: 'Azerty',
      organizationId,
    });
    const participation1 = databaseBuilder.factory.buildCombinedCourseParticipation({
      organizationLearnerId: learner.id,
      questId,
      status: CombinedCourseParticipationStatuses.COMPLETED,
    });
    const { questId: anotherquestId } = databaseBuilder.factory.buildCombinedCourse({ code: 'COMBI2' });
    databaseBuilder.factory.buildCombinedCourseParticipation({
      organizationLearnerId: learner.id,
      questId: anotherquestId,
      status: CombinedCourseParticipationStatuses.COMPLETED,
    });

    await databaseBuilder.commit();

    // when
    const { combinedCourseParticipations } = await usecases.findCombinedCourseParticipations({ combinedCourseId });

    // then
    expect(combinedCourseParticipations).lengthOf(1);
    expect(combinedCourseParticipations[0]).instanceOf(CombinedCourseParticipation);
    expect(combinedCourseParticipations).deep.equal([
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
