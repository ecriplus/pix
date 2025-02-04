import { createServer, expect } from '../../../test-helper.js';

describe('Acceptance | Shared | Application | Route | healthcheck', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('GET /api/healthcheck/forwarded-origin', function () {
    it('returns an HTTP status code 200 with the forwarded origin', async function () {
      // given
      const options = {
        method: 'GET',
        url: '/api/healthcheck/forwarded-origin',
        headers: { 'x-forwarded-proto': 'https', 'x-forwarded-host': 'app.pix.org' },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.equal('https://app.pix.org');
    });
  });
});
