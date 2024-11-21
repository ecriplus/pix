import { certificationResultsController } from '../../../../../src/certification/results/application/certification-results-controller.js';
import * as moduleUnderTest from '../../../../../src/certification/results/application/certification-results-route.js';
import { authorization } from '../../../../../src/certification/shared/application/pre-handlers/authorization.js';
import { securityPreHandlers } from '../../../../../src/shared/application/security-pre-handlers.js';
import { expect, HttpTestServer, sinon } from '../../../../test-helper.js';

describe('Certification | Results | Unit | Application | Certification Results Route', function () {
  describe('GET /api/admin/certifications/{id}/certified-profile', function () {
    it('should exist', async function () {
      // given
      sinon.stub(securityPreHandlers, 'hasAtLeastOneAccessOf').returns(() => true);
      sinon.stub(certificationResultsController, 'getCertifiedProfile').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/admin/certifications/1234/certified-profile');

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  describe('GET /api/sessions/{sessionId}/certified-clea-candidate-data', function () {
    it('should exist', async function () {
      // given
      sinon.stub(authorization, 'verifySessionAuthorization').returns(null);
      sinon.stub(certificationResultsController, 'getCleaCertifiedCandidateDataCsv').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/sessions/3/certified-clea-candidate-data');

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
