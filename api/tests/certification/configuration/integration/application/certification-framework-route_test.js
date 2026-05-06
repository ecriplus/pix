import sinon from 'sinon';

import { certificationFrameworkController } from '../../../../../src/certification/configuration/application/certification-framework-controller.js';
import * as moduleUnderTest from '../../../../../src/certification/configuration/application/certification-framework-route.js';
import { securityPreHandlers } from '../../../../../src/shared/application/security-pre-handlers.js';
import { expect } from '../../../../test-helper.js';
import { HttpTestServer } from '../../../../tooling/server/http-test-server.js';

describe('Integration | Certification | Configuration | Application | Router | certification-framework-route', function () {
  describe('GET /api/admin/certification-frameworks/{scope}/framework-history', function () {
    describe('Error cases', function () {
      let httpTestServer;

      beforeEach(async function () {
        sinon.stub(securityPreHandlers, 'hasAtLeastOneAccessOf').returns(() => true);
        httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);
      });

      it('should return 400 when scope parameter is not valid', async function () {
        sinon.stub(certificationFrameworkController, 'getFrameworkHistory').returns('ok');

        const response = await httpTestServer.request(
          'GET',
          '/api/admin/certification-frameworks/INVALID_SCOPE/framework-history',
        );

        expect(response.statusCode).to.equal(400);
      });
    });
  });

  describe('GET /api/admin/certification-frameworks/{scope}/target-profiles', function () {
    describe('Error cases', function () {
      let httpTestServer;

      beforeEach(async function () {
        sinon.stub(securityPreHandlers, 'hasAtLeastOneAccessOf').returns(() => true);
        httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);
      });

      it('should return 400 when scope parameter is not valid', async function () {
        sinon.stub(certificationFrameworkController, 'getTargetProfileHistory').returns('ok');

        const response = await httpTestServer.request(
          'GET',
          '/api/admin/certification-frameworks/INVALID_SCOPE/target-profiles',
        );

        expect(response.statusCode).to.equal(400);
      });
      it('should return 400 when scope parameter is CORE', async function () {
        sinon.stub(certificationFrameworkController, 'getTargetProfileHistory').returns('ok');

        const response = await httpTestServer.request(
          'GET',
          '/api/admin/certification-frameworks/CORE/target-profiles',
        );

        expect(response.statusCode).to.equal(400);
      });
    });
  });
});
