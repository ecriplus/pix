import {
  createServer,
  databaseBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
  insertUserWithRoleSuperAdmin,
} from '../../../../test-helper.js';

describe('Acceptance | Controller | Modules Metadata | Route', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('GET /api/admin/modules-metadata', function () {
    context('when modules exists', function () {
      it('should return modules metadata', async function () {
        // given
        const superAdmin = await insertUserWithRoleSuperAdmin();
        await databaseBuilder.commit();

        const options = {
          method: 'GET',
          url: `/api/admin/modules-metadata`,
          headers: generateAuthenticatedUserRequestHeaders({ userId: superAdmin.id }),
        };

        const response = await server.inject(options);

        expect(response.statusCode).to.equal(200);
      });
    });
  });
});
