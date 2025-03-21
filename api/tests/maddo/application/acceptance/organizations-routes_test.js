import { Organization } from '../../../../src/maddo/domain/models/Organization.js';
import {
  createMaddoServer,
  databaseBuilder,
  expect,
  generateValidRequestAuthorizationHeaderForApplication,
} from '../../../test-helper.js';

describe('Acceptance | Maddo | Route | Organizations', function () {
  let server;

  beforeEach(async function () {
    server = await createMaddoServer();
  });

  describe('GET /api/organizations', function () {
    it('returns the list of all organizations of the client jurisdiction with an HTTP status code 200', async function () {
      // given
      const orgaInJurisdiction = databaseBuilder.factory.buildOrganization({ name: 'orga-in-jurisdiction' });
      const orgaAlsoInJurisdiction = databaseBuilder.factory.buildOrganization({ name: 'orga-also-in-jurisdiction' });
      databaseBuilder.factory.buildOrganization({ name: 'orga-not-in-jurisdiction' });

      const tag = databaseBuilder.factory.buildTag();
      databaseBuilder.factory.buildOrganizationTag({ organizationId: orgaInJurisdiction.id, tagId: tag.id });
      databaseBuilder.factory.buildOrganizationTag({ organizationId: orgaAlsoInJurisdiction.id, tagId: tag.id });

      const clientId = 'client';
      databaseBuilder.factory.buildClientApplication({
        clientId: 'client',
        jurisdiction: { rules: [{ name: 'tags', value: [tag.name] }] },
      });

      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: '/api/organizations',
        headers: {
          authorization: generateValidRequestAuthorizationHeaderForApplication(clientId, 'pix-client', 'meta'),
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.deep.equal([
        new Organization({ id: orgaInJurisdiction.id, name: orgaInJurisdiction.name }),
        new Organization({ id: orgaAlsoInJurisdiction.id, name: orgaAlsoInJurisdiction.name }),
      ]);
    });
  });
});
