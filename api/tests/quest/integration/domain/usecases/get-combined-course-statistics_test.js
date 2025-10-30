import { CombinedCourseStatistics } from '../../../../../src/quest/domain/models/CombinedCourseStatistics.js';
import {
  OrganizationLearnerParticipationStatuses,
  OrganizationLearnerParticipationTypes,
} from '../../../../../src/quest/domain/models/OrganizationLearnerParticipation.js';
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
    const { id: combinedCourseId } = databaseBuilder.factory.buildCombinedCourse({
      code: 'COMBI1',
      organizationId,
    });
    databaseBuilder.factory.buildOrganizationLearnerParticipation({
      type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      organizationLearnerId: learner.id,
      combinedCourseId,
      status: OrganizationLearnerParticipationStatuses.COMPLETED,
    });
    databaseBuilder.factory.buildOrganizationLearnerParticipation({
      type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      organizationLearnerId: learner2.id,
      combinedCourseId,
      status: OrganizationLearnerParticipationStatuses.STARTED,
    });

    const { id: anotherCombinedCourseId } = databaseBuilder.factory.buildCombinedCourse({
      code: 'COMBI2',
    });
    databaseBuilder.factory.buildOrganizationLearnerParticipation({
      type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      organizationLearnerId: learner.id,
      combinedCourseId: anotherCombinedCourseId,
      status: OrganizationLearnerParticipationStatuses.COMPLETED,
    });

    await databaseBuilder.commit();

    // when
    const result = await usecases.getCombinedCourseStatistics({ combinedCourseId });

    // then
    expect(result).instanceOf(CombinedCourseStatistics);
    expect(result).deep.equal({
      id: combinedCourseId,
      participationsCount: 2,
      completedParticipationsCount: 1,
    });
  });
});
