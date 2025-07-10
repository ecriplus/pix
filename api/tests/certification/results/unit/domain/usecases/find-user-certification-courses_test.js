import { findUserCertificationCourses } from '../../../../../../src/certification/results/domain/usecases/find-user-certification-courses.js';
import { expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Certification | Results | UseCases | find-user-certification-courses', function () {
  it('should call findAllByUserId repository method', async function () {
    // given
    const userId = Symbol('userId');

    const certificationCourseRepository = {
      findAllByUserId: sinon.stub(),
    };

    // when
    await findUserCertificationCourses({
      userId,
      certificationCourseRepository,
    });

    // then
    expect(certificationCourseRepository.findAllByUserId.calledOnceWithExactly({ userId })).to.be.true;
  });
});
