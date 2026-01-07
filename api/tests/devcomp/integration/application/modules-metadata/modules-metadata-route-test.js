import { PIX_ADMIN } from '../../../../../src/authorization/domain/constants.js';
import * as moduleUnderTest from '../../../../../src/devcomp/application/modules-metadata/module-metadata-route.js';
import {
  databaseBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
  HttpTestServer,
} from '../../../../test-helper.js';

describe('Integration | Devcomp | Application | Route | ModulesMetadata', function () {
  let httpTestServer;

  beforeEach(async function () {
    httpTestServer = new HttpTestServer();
    httpTestServer.setupAuthentication();
    await httpTestServer.register(moduleUnderTest);
  });

  describe('GET /api/admin/modules-metadata', function () {
    context('when user does not have superadmin or metier role', function () {
      it('returns 403 HTTP status code', async function () {
        // given
        const user = databaseBuilder.factory.buildUser.withRole({ role: PIX_ADMIN.ROLES.CERTIF });
        //  when
        const response = await httpTestServer.request(
          'GET',
          '/api/admin/modules-metadata',
          null,
          null,
          generateAuthenticatedUserRequestHeaders({ userId: user.id }),
        );

        // then
        expect(response.statusCode).to.equal(403);
      });
    });
  });
});
