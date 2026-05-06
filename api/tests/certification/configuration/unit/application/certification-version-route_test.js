import sinon from 'sinon';

import { certificationVersionController } from '../../../../../src/certification/configuration/application/certification-version-controller.js';
import * as moduleUnderTest from '../../../../../src/certification/configuration/application/certification-version-route.js';
import { securityPreHandlers } from '../../../../../src/shared/application/security-pre-handlers.js';
import { expect } from '../../../../test-helper.js';
import { HttpTestServer } from '../../../../tooling/server/http-test-server.js';

describe('Unit | Certification | Configuration | Application | Router | certification-version-route', function () {
  describe('GET /api/admin/certification-versions/{scope}/active', function () {
    describe('when the user authenticated has no role', function () {
      it('should return 403 HTTP status code', async function () {
        sinon
          .stub(securityPreHandlers, 'hasAtLeastOneAccessOf')
          .returns((request, h) => h.response().code(403).takeover());
        sinon.stub(certificationVersionController, 'getActiveVersionByScope').returns('ok');
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const response = await httpTestServer.request('GET', '/api/admin/certification-versions/CORE/active');

        expect(response.statusCode).to.equal(403);
        sinon.assert.notCalled(certificationVersionController.getActiveVersionByScope);
      });
    });

    describe('when the scope parameter is invalid', function () {
      it('should return 400 HTTP status code when scope is not a valid Framework', async function () {
        sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').returns(true);
        sinon.stub(certificationVersionController, 'getActiveVersionByScope').returns('ok');
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const response = await httpTestServer.request('GET', '/api/admin/certification-versions/INVALID_SCOPE/active');

        expect(response.statusCode).to.equal(400);
        sinon.assert.notCalled(certificationVersionController.getActiveVersionByScope);
      });
    });
  });

  describe('GET /api/admin/certification-versions/{certificationVersionId}', function () {
    describe('when the user authenticated has no role', function () {
      it('should return 403 HTTP status code', async function () {
        // given
        sinon
          .stub(securityPreHandlers, 'hasAtLeastOneAccessOf')
          .returns((request, h) => h.response().code(403).takeover());
        sinon.stub(certificationVersionController, 'getVersionById').returns('ok');
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const response = await httpTestServer.request('GET', `/api/admin/certification-versions/1`);

        // then
        expect(response.statusCode).to.equal(403);
        sinon.assert.notCalled(certificationVersionController.getVersionById);
      });
    });

    const authorizedRoles = ['SuperAdmin', 'Certif', 'Metier', 'Support'];
    authorizedRoles.forEach((role) => {
      describe(`when the user has ${role} role`, function () {
        it('should return 200 HTTP status code', async function () {
          // given
          sinon.stub(securityPreHandlers, `checkAdminMemberHasRole${role}`).returns(true);
          sinon.stub(certificationVersionController, 'getVersionById').returns('ok');

          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          // when
          const response = await httpTestServer.request('GET', `/api/admin/certification-versions/1`);

          // then
          expect(response.statusCode).to.equal(200);
          sinon.assert.calledOnce(certificationVersionController.getVersionById);
        });
      });
    });

    describe('when the scope parameter is invalid', function () {
      it('should return 400 HTTP status code when scope is not a valid id', async function () {
        sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').returns(true);
        sinon.stub(certificationVersionController, 'getVersionById').returns('ok');
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const response = await httpTestServer.request('GET', '/api/admin/certification-versions/NOT_AN_ID');

        expect(response.statusCode).to.equal(400);
        sinon.assert.notCalled(certificationVersionController.getVersionById);
      });
    });
  });
});
