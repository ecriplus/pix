import { CombinedCourseBlueprint } from '../../../../src/quest/domain/models/CombinedCourseBlueprint.js';
import {
  createServer,
  databaseBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
  insertUserWithRoleSuperAdmin,
} from '../../../test-helper.js';

describe('Quest | Acceptance | Application | Combined course blueprint Route ', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('GET /api/combined-course-blueprints', function () {
    context('when user is admin ', function () {
      it('should return the list of combined course blueprints', async function () {
        // given
        const adminUser = await insertUserWithRoleSuperAdmin();

        databaseBuilder.factory.buildCombinedCourseBlueprint({
          content: CombinedCourseBlueprint.buildContentItems([{ moduleId: 'mon-module' }]),
        });
        databaseBuilder.factory.buildCombinedCourseBlueprint({
          content: CombinedCourseBlueprint.buildContentItems([{ moduleId: 'mon-module-abc' }]),
        });
        await databaseBuilder.commit();

        const options = {
          method: 'GET',
          url: `/api/combined-course-blueprints`,
          headers: generateAuthenticatedUserRequestHeaders({ userId: adminUser.id }),
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data).to.have.lengthOf(2);
      });
    });
  });
});
