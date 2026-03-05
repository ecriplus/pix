import {
  createServer,
  databaseBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
  insertUserWithRoleSuperAdmin,
  knex,
} from '../../../../test-helper.js';

describe('Acceptance | Organizational Entities | Application | Route | Admin | Network', function () {
  let superAdmin;
  let server;

  beforeEach(async function () {
    superAdmin = await insertUserWithRoleSuperAdmin();
    await databaseBuilder.commit();

    server = await createServer();
  });

  describe('POST /api/admin/networks', function () {
    it('creates a new network', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      await databaseBuilder.commit();

      const request = {
        method: 'POST',
        url: '/api/admin/networks',
        headers: generateAuthenticatedUserRequestHeaders(superAdmin),
        payload: {
          data: {
            attributes: {
              'network-name': 'Network name',
              'organization-id': organizationId,
            },
          },
        },
      };

      // when
      const response = await server.inject(request);

      // then
      expect(response.statusCode).to.equal(201);
      const createdNetwork = await knex('networks').first();
      expect(createdNetwork.name).to.equal('Network name');
    });
  });
});
