import * as checkUserCanManageCombinedCourse from '../../../../../src/quest/application/usecases/check-user-can-manage-combined-course.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Application | Usecases | checkUserCanManageCombinedCourse', function () {
  context('when user has membership in combined course organization', function () {
    it('should return true', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const combinedCourseId = databaseBuilder.factory.buildCombinedCourse({ organizationId }).id;
      databaseBuilder.factory.buildMembership({ userId, organizationId });
      await databaseBuilder.commit();

      // when
      const canManage = await checkUserCanManageCombinedCourse.execute({ userId, combinedCourseId });

      // then
      expect(canManage).to.be.true;
    });
  });

  context('when user does not have membership in combined course organization', function () {
    it('should return false', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const combinedCourseId = databaseBuilder.factory.buildCombinedCourse({ organizationId }).id;
      await databaseBuilder.commit();

      // when
      const canManage = await checkUserCanManageCombinedCourse.execute({ userId, combinedCourseId });

      // then
      expect(canManage).to.be.false;
    });
  });

  context('when quest is not a combined course', function () {
    it('should throw NotFoundError', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;

      await databaseBuilder.commit();

      // when / then
      const error = await catchErr(checkUserCanManageCombinedCourse.execute)({ userId, combinedCourseId: 12 });
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });

  context('when user has disabled membership in combined course organization', function () {
    it('should return false', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const combinedCourseId = databaseBuilder.factory.buildCombinedCourse({ organizationId }).id;
      databaseBuilder.factory.buildMembership({ userId, organizationId, disabledAt: new Date() });
      await databaseBuilder.commit();

      // when
      const canManage = await checkUserCanManageCombinedCourse.execute({ userId, combinedCourseId });

      // then
      expect(canManage).to.be.false;
    });
  });
});
