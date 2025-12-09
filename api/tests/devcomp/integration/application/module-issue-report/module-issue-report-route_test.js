import * as moduleUnderTest from '../../../../../src/devcomp/application/module-issue-report/module-issue-report-route.js';
import { expect, HttpTestServer } from '../../../../test-helper.js';

describe('Integration | Devcomp | Application | Module | Router | module-issue-report-router', function () {
  describe('POST /api/module-issue-reports', function () {
    describe('when provided payload is empty', function () {
      it('should return an HTTP 400 error', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);
        const invalidPayload = {};

        // when
        const response = await httpTestServer.request('POST', '/api/module-issue-reports', invalidPayload);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

    describe('when some attributes are missing in payload', function () {
      it('should return an HTTP 400 error', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);
        const payloadWithoutCategoryKey = {
          'module-id': '6282925d-4775-4bca-b513-4c3009ec5886',
          'element-id': '96e29215-3610-4bc6-b4a6-026bf13276b8',
          'passage-id': '12',
          comment: "Pix c'est génial.",
        };

        // when
        const response = await httpTestServer.request('POST', '/api/module-issue-reports', payloadWithoutCategoryKey);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });
});
