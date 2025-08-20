import * as checkAuthorizationToAccessCombinedCourse from '../../../../../src/quest/application/usecases/check-authorization-to-access-combined-course.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Unit | Application | Usecases | checkAuthorizationToAccessCombinedCourse', function () {
  it('should return true if user belongs to combined course organization', async function () {
    // given
    const code = 'COMBINIX1';
    const userId = databaseBuilder.factory.buildUser().id;
    const organizationId = databaseBuilder.factory.buildOrganization().id;
    databaseBuilder.factory.buildQuestForCombinedCourse({ code, organizationId });
    databaseBuilder.factory.buildOrganizationLearner({ organizationId, userId });
    await databaseBuilder.commit();

    // when
    const authorized = await checkAuthorizationToAccessCombinedCourse.execute({ code, userId });

    // then
    expect(authorized).to.be.true;
  });

  it('should return false otherwise', async function () {
    // given
    const code = 'COMBINIX1';
    const userId = databaseBuilder.factory.buildUser().id;
    const organizationId = databaseBuilder.factory.buildOrganization().id;
    databaseBuilder.factory.buildQuestForCombinedCourse({ code, organizationId });
    await databaseBuilder.commit();

    // when
    const authorized = await checkAuthorizationToAccessCombinedCourse.execute({ code, userId });

    // then
    expect(authorized).to.be.false;
  });
});
