import { getCombinedCourseByCode } from '../../../../../src/quest/domain/usecases/get-combined-course-by-code.js';
import { catchErr, expect, sinon } from '../../../../test-helper.js';

describe('Quest | Unit | Domain | Usecases | getCombinedCourseByCode', function () {
  it('should throw error if not a NotFoundError', async function () {
    // given
    const userId = Symbol('userId');
    const code = Symbol('code');
    const questId = Symbol('questId');
    const combinedCourse = Symbol('CombinedCourse');

    const questRepositoryStub = { getByCode: sinon.stub() };
    const combinedCourseRepositoryStub = { getByCode: sinon.stub() };
    const combinedCourseParticipationRepositoryStub = { getByUserId: sinon.stub() };

    questRepositoryStub.getByCode.resolves({ questId, userId });
    combinedCourseRepositoryStub.getByCode.resolves(combinedCourse);
    combinedCourseParticipationRepositoryStub.getByUserId.rejects(new Error('oops'));

    // when
    const error = await catchErr(getCombinedCourseByCode)({
      userId,
      code,
      questRepository: questRepositoryStub,
      combinedCourseRepository: combinedCourseRepositoryStub,
      combinedCourseParticipationRepository: combinedCourseParticipationRepositoryStub,
    });

    // then
    expect(error).to.be.instanceOf(Error);
    expect(error.message).to.equal('oops');
  });
});
