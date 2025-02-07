import { certificationCenterController } from '../../../../lib/application/certification-centers/certification-center-controller.js';
import * as moduleUnderTest from '../../../../lib/application/certification-centers/index.js';
import { securityPreHandlers } from '../../../../src/shared/application/security-pre-handlers.js';
import { expect, HttpTestServer, sinon } from '../../../test-helper.js';

describe('Unit | Router | certification-center-router', function () {
  describe('GET /api/admin/certification-centers/{certificationCenterId}/certification-center-memberships', function () {
    const method = 'GET';
    const url = '/api/admin/certification-centers/1/certification-center-memberships';

    it('should exist', async function () {
      //given
      sinon.stub(securityPreHandlers, 'hasAtLeastOneAccessOf').returns(() => true);
      sinon
        .stub(certificationCenterController, 'findCertificationCenterMembershipsByCertificationCenter')
        .returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request(method, url);

      // then
      expect(result.statusCode).to.equal(200);
    });

    it('should reject an invalid certification-centers id', async function () {
      //given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      // when
      const result = await httpTestServer.request(
        method,
        '/api/admin/certification-centers/invalid/certification-center-memberships',
      );

      // then
      expect(result.statusCode).to.equal(400);
    });
  });
});
