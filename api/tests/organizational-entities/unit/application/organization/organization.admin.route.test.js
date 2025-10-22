import { organizationAdminController } from '../../../../../src/organizational-entities/application/organization/organization.admin.controller.js';
import * as moduleUnderTest from '../../../../../src/organizational-entities/application/organization/organization.admin.route.js';
import { securityPreHandlers } from '../../../../../src/shared/application/security-pre-handlers.js';
import { expect, HttpTestServer, sinon } from '../../../../test-helper.js';

describe('Unit | Organizational Entities | Application | route | Admin | organization', function () {
  let httpTestServer;

  beforeEach(async function () {
    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  describe('POST /api/admin/organizations/{childOrganizationId}/detach-parent-organization', function () {
    describe('error case', function () {
      describe('when the authenticated user is not super admin', function () {
        it('should return 403 HTTP status code', async function () {
          // given
          sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').callsFake((request, h) =>
            h
              .response({ errors: new Error('forbidden') })
              .code(403)
              .takeover(),
          );
          sinon.stub(organizationAdminController, 'detachParentOrganization');

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/admin/organizations/123/detach-parent-organization',
          );

          // then
          expect(response.statusCode).to.equal(403);
          sinon.assert.notCalled(organizationAdminController.detachParentOrganization);
        });
      });

      describe('when childOrganizationId is not a number', function () {
        it('should return 400 HTTP status code', async function () {
          // given
          sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').resolves(true);
          sinon.stub(organizationAdminController, 'detachParentOrganization');

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/admin/organizations/mqlksdmdlk/detach-parent-organization',
          );

          // then
          expect(response.statusCode).to.equal(400);
          sinon.assert.notCalled(organizationAdminController.detachParentOrganization);
        });
      });
    });
  });
});
