import { certificationFrameworkController } from '../../../../../src/certification/configuration/application/certification-framework-controller.js';
import * as moduleUnderTest from '../../../../../src/certification/configuration/application/certification-framework-route.js';
import { Scopes } from '../../../../../src/certification/shared/domain/models/Scopes.js';
import { securityPreHandlers } from '../../../../../src/shared/application/security-pre-handlers.js';
import { expect, HttpTestServer, sinon } from '../../../../test-helper.js';

describe('Unit | Certification | Configuration | Application | Router | certification-framework-route', function () {
  describe('GET /api/admin/certification-frameworks', function () {
    describe('when the user authenticated has no role', function () {
      it('should return 403 HTTP status code', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'hasAtLeastOneAccessOf')
          .returns((request, h) => h.response().code(403).takeover());
        sinon.stub(certificationFrameworkController, 'findCertificationFrameworks').returns('ok');
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const response = await httpTestServer.request('GET', '/api/admin/certification-frameworks');

        // then
        expect(response.statusCode).to.equal(403);
        sinon.assert.notCalled(certificationFrameworkController.findCertificationFrameworks);
      });
    });

    const authorizedRoles = [
      { role: 'SuperAdmin', stub: 'checkAdminMemberHasRoleSuperAdmin' },
      { role: 'Support', stub: 'checkAdminMemberHasRoleSupport' },
      { role: 'Certif', stub: 'checkAdminMemberHasRoleCertif' },
      { role: 'Metier', stub: 'checkAdminMemberHasRoleMetier' },
    ];

    authorizedRoles.forEach(({ role, stub }) => {
      describe(`when the user has ${role} role`, function () {
        it('should return 200 HTTP status code', async function () {
          // given
          sinon.stub(securityPreHandlers, stub).callsFake((request, h) => h.response(true));
          sinon.stub(securityPreHandlers, 'hasAtLeastOneAccessOf').callsFake((_handlers) => {
            return () => true;
          });
          sinon.stub(certificationFrameworkController, 'findCertificationFrameworks').returns('ok');

          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const response = await httpTestServer.request('GET', '/api/admin/certification-frameworks');

          // then
          expect(response.statusCode).to.equal(200);
          sinon.assert.calledOnce(certificationFrameworkController.findCertificationFrameworks);
        });
      });
    });
  });

  describe('GET /api/admin/certification-frameworks/{scope}/active-consolidated-framework', function () {
    describe('when the user authenticated has no role', function () {
      it('should return 403 HTTP status code', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'hasAtLeastOneAccessOf')
          .returns((request, h) => h.response().code(403).takeover());
        sinon.stub(certificationFrameworkController, 'getActiveConsolidatedFramework').returns('ok');
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const response = await httpTestServer.request(
          'GET',
          `/api/admin/certification-frameworks/${Scopes.CORE}/active-consolidated-framework`,
        );

        // then
        expect(response.statusCode).to.equal(403);
        sinon.assert.notCalled(certificationFrameworkController.getActiveConsolidatedFramework);
      });
    });

    describe('when the user has an authorized role', function () {
      const authorizedRoles = ['SuperAdmin', 'Support', 'Certif', 'Metier'];

      authorizedRoles.forEach((role) => {
        it(`should return 200 HTTP status code when user has ${role} role`, async function () {
          // given
          sinon.stub(securityPreHandlers, 'hasAtLeastOneAccessOf').callsFake(() => (request, h) => h.response(true));
          sinon.stub(certificationFrameworkController, 'getActiveConsolidatedFramework').returns('ok');
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const response = await httpTestServer.request(
            'GET',
            `/api/admin/certification-frameworks/${Scopes.CORE}/active-consolidated-framework`,
          );

          // then
          expect(response.statusCode).to.equal(200);
          sinon.assert.calledOnce(certificationFrameworkController.getActiveConsolidatedFramework);
        });
      });
    });
  });
});
