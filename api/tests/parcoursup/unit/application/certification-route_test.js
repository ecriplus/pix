import { certificationController } from '../../../../src/parcoursup/application/certification-controller.js';
import * as moduleUnderTest from '../../../../src/parcoursup/application/certification-route.js';
import { securityPreHandlers } from '../../../../src/shared/application/security-pre-handlers.js';
import { expect, HttpTestServer, sinon } from '../../../test-helper.js';

describe('Parcoursup | Unit | Application | Routes | Certification', function () {
  describe('GET /parcoursup/students/{ine}/certification', function () {
    it('should return 200', async function () {
      //given
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').returns(true);
      sinon.stub(certificationController, 'getCertificationResult').callsFake((request, h) => h.response().code(200));

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/parcoursup/students/123456789OK/certification');

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
