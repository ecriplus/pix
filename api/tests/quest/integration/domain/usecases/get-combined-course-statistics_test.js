import { CombinedCourseParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { CombinedCourseStatistics } from '../../../../../src/quest/domain/models/CombinedCourseStatistics.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Quest | Integration | Domain | Usecases | getCombinedCourseStatistics', function () {
  it('should return adequate combined course participations statistics', async function () {
    // given :
    const organizationId = databaseBuilder.factory.buildOrganization().id;
    const learner = databaseBuilder.factory.buildOrganizationLearner({
      organizationId,
      firstName: 'Paul',
      lastName: 'Azerty',
    });
    const learner2 = databaseBuilder.factory.buildOrganizationLearner({
      organizationId,
      firstName: 'John',
      lastName: 'Qwerty',
    });
    const questId = databaseBuilder.factory.buildQuestForCombinedCourse({ organizationId }).id;
    databaseBuilder.factory.buildCombinedCourseParticipation({
      organizationLearnerId: learner.id,
      questId,
      status: CombinedCourseParticipationStatuses.COMPLETED,
    });
    databaseBuilder.factory.buildCombinedCourseParticipation({
      organizationLearnerId: learner2.id,
      questId,
      status: CombinedCourseParticipationStatuses.STARTED,
    });

    const anotherquestId = databaseBuilder.factory.buildQuestForCombinedCourse().id;
    databaseBuilder.factory.buildCombinedCourseParticipation({
      organizationLearnerId: learner.id,
      questId: anotherquestId,
      status: CombinedCourseParticipationStatuses.COMPLETED,
    });

    await databaseBuilder.commit();

    // when
    const result = await usecases.getCombinedCourseStatistics({ questId });

    // then
    expect(result).instanceOf(CombinedCourseStatistics);
    expect(result).deep.equal({
      id: questId,
      participationsCount: 2,
      completedParticipationsCount: 1,
    });
  });
});
