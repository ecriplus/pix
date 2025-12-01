import CombinedCourseDetailsService from '../../../../../src/quest/domain/services/combined-course-details-service.js';
import { catchErr, expect, sinon } from '../../../../test-helper.js';

describe('Quest | Unit | Domain | Usecases | getCombinedCourseByCode', function () {
  it('should throw error if not a NotFoundError', async function () {
    // given
    const organizationLearnerId = Symbol('organizationLearnerId');
    const combinedCourseId = Symbol('combinedCourseId');
    const combinedCourse = Symbol('CombinedCourse');
    const quest = Symbol('Quest');

    const questRepositoryStub = { findById: sinon.stub() };
    const combinedCourseRepositoryStub = { getById: sinon.stub() };
    const combinedCourseParticipationRepositoryStub = { findMostRecentByLearnerId: sinon.stub() };

    questRepositoryStub.findById.resolves(quest);
    combinedCourseRepositoryStub.getById.resolves(combinedCourse);
    combinedCourseParticipationRepositoryStub.findMostRecentByLearnerId
      .withArgs({ organizationLearnerId, combinedCourseId })
      .rejects(new Error('oops'));

    // when
    const error = await catchErr(CombinedCourseDetailsService.getCombinedCourseDetails)({
      organizationLearnerId,
      combinedCourseId,
      questRepository: questRepositoryStub,
      combinedCourseRepository: combinedCourseRepositoryStub,
      combinedCourseParticipationRepository: combinedCourseParticipationRepositoryStub,
    });

    // then
    expect(error).to.be.instanceOf(Error);
    expect(error.message).to.equal('oops');
  });
});
