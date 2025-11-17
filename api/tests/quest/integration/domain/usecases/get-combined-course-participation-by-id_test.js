import {
  OrganizationLearnerParticipationStatuses,
  OrganizationLearnerParticipationTypes,
} from '../../../../../src/quest/domain/models/OrganizationLearnerParticipation.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect } from '../../../../test-helper.js';

describe('Quest | Integration | Domain | Usecases | getCombinedCourseParticipationById', function () {
  it('should return a participation with given id', async function () {
    // given
    const { id: organizationLearnerId, firstName, lastName } = databaseBuilder.factory.buildOrganizationLearner();
    const { id: participationId } = databaseBuilder.factory.buildOrganizationLearnerParticipation({
      organizationLearnerId,
      status: OrganizationLearnerParticipationStatuses.STARTED,
      type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
    });
    await databaseBuilder.commit();

    // when
    const result = await usecases.getCombinedCourseParticipationById({ participationId });

    // then
    expect(result.id).equal(participationId);
    expect(result.firstName).equal(firstName);
    expect(result.lastName).equal(lastName);
  });

  it('should throw when no participation found', async function () {
    // given
    const participationId = 12;

    // when
    const error = await catchErr(usecases.getCombinedCourseParticipationById)({ participationId });

    // then
    expect(error).to.be.instanceof(NotFoundError);
    expect(error.message).to.equal(`CombinedCourseParticipation introuvable à l'id ${participationId}`);
  });
});
