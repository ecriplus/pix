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

  describe('GET /api/admin/networks', function () {
    it('returns a list of networks with 200 HTTP status code', async function () {
      // given
      const server = await createServer();
      const network1 = databaseBuilder.factory.buildNetwork({ name: 'Team1' });
      const network2 = databaseBuilder.factory.buildNetwork({ name: 'Team2' });
      await databaseBuilder.commit();
      const options = {
        method: 'GET',
        url: '/api/admin/networks',
        headers: generateAuthenticatedUserRequestHeaders(superAdmin),
      };
      const expectedNetworks = [
        {
          attributes: {
            name: network1.name,
          },
          id: network1.id.toString(),
          type: 'networks',
        },
        {
          attributes: {
            name: network2.name,
          },
          id: network2.id.toString(),
          type: 'networks',
        },
      ];

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data).to.deep.equal(expectedNetworks);
    });
  });

  describe('GET /api/admin/networks/1', function () {
    it('returns a list of networks with 200 HTTP status code', async function () {
      // given
      const server = await createServer();
      const network = databaseBuilder.factory.buildNetworkAndHeadOrganization({
        id: 1,
        name: 'Mon réseau',
        organizationId: 555,
        organizationName: 'Tête de réseau',
      });
      await databaseBuilder.commit();
      const options = {
        method: 'GET',
        url: '/api/admin/networks/1',
        headers: generateAuthenticatedUserRequestHeaders(superAdmin),
      };
      const expectedNetwork = {
        attributes: {
          name: network.name,
          'head-organization': {
            id: 555,
            name: 'Tête de réseau',
          },
        },
        id: network.id.toString(),
        type: 'networks',
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data).to.deep.equal(expectedNetwork);
    });
  });

  describe('GET /api/admin/networks with filter', function () {
    it('returns filtered networks by name with 200 HTTP status code', async function () {
      // given
      const matchingNetwork = databaseBuilder.factory.buildNetwork({ name: 'Réseau Bretagne' });
      databaseBuilder.factory.buildNetwork({ name: 'Autre réseau' });
      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: '/api/admin/networks?filter[name]=Bretagne',
        headers: generateAuthenticatedUserRequestHeaders(superAdmin),
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data).to.have.lengthOf(1);
      expect(response.result.data[0].id).to.equal(matchingNetwork.id.toString());
      expect(response.result.data[0].attributes.name).to.equal(matchingNetwork.name);
    });
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
              name: 'Network name',
              'organization-id': organizationId,
            },
          },
        },
      };

      // when
      const response = await server.inject(request);

      // then
      const createdNetwork = await knex('networks').first();
      expect(response.statusCode).to.equal(201);
      expect(response.result.data.id).to.equal(createdNetwork.id.toString());
      expect(response.result.data.attributes.name).to.equal('Network name');
    });
  });
});
