import * as checkDeletedOfCombinedCourse from '../../../../src/quest/application/usecases/check-deleted-of-combined-course.js';
import { expect, sinon } from '../../../test-helper.js';

describe('Unit | UseCase | check-deleted-of-combined-course', function () {
  let combinedCourseRepositoryStub;

  beforeEach(function () {
    combinedCourseRepositoryStub = {
      getById: sinon.stub().resolves({ deletedAt: null }),
      getByCode: sinon.stub().resolves({ deletedAt: null }),
    };
  });

  it('should call getByCode if code is given into parameters', async function () {
    await checkDeletedOfCombinedCourse.execute({
      code: 'RANDOM',
      dependencies: { combinedCourseRepository: combinedCourseRepositoryStub },
    });
    expect(combinedCourseRepositoryStub.getByCode).to.be.calledWithExactly({ code: 'RANDOM' });
  });
  it('should call getById if id is given into parameters', async function () {
    await checkDeletedOfCombinedCourse.execute({
      id: 1,
      dependencies: { combinedCourseRepository: combinedCourseRepositoryStub },
    });
    expect(combinedCourseRepositoryStub.getById).to.be.calledWithExactly({ id: 1 });
  });
});
