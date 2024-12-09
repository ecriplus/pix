import { certificationCenterController } from '../../../../../lib/application/certification-centers/certification-center-controller.js';
import * as moduleUnderTest from '../../../../../src/certification/session-management/application/certification-centers-session-summaries.route.js';
import { expect, HttpTestServer, sinon } from '../../../../test-helper.js';

describe('Certification | Session-management | Unit | Application | Routes | session-summaries', function () {
  describe('GET /api/certification-centers/{certificationCenterId}/session-summaries', function () {
    it('should return 200', async function () {
      // given
      sinon.stub(certificationCenterController, 'findPaginatedSessionSummaries').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/certification-centers/123/session-summaries');

      // then
      expect(response.statusCode).to.equal(200);
      sinon.assert.calledOnce(certificationCenterController.findPaginatedSessionSummaries);
    });
  });
});
