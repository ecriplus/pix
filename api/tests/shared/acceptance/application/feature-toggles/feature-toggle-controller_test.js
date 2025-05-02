import { createServer, expect } from '../../../../test-helper.js';

describe('Acceptance | Shared | Application | Controller | feature-toggle', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('GET /api/feature-toggles', function () {
    const options = {
      method: 'GET',
      url: '/api/feature-toggles',
    };

    it('should return 200 with feature toggles', async function () {
      // given
      const expectedData = {
        data: {
          id: '0',
          type: 'feature-toggles',
          attributes: {
            'deprecate-pole-emploi-push-notification': false,
            'dynamic-feature-toggle-system': false,
            'is-always-ok-validate-next-challenge-endpoint-enabled': false,
            'is-async-quest-rewarding-calculation-enabled': false,
            'is-direct-metrics-enabled': false,
            'is-results-shared-modal-enabled': false,
            'is-new-account-recovery-enabled': false,
            'is-need-to-adjust-certification-accessibility-enabled': false,
            'is-oppsy-disabled': false,
            'is-pix-app-new-layout-enabled': false,
            'is-pix-admin-new-sidebar-enabled': false,
            'is-pix-companion-enabled': false,
            'is-quest-enabled': false,
            'is-self-account-deletion-enabled': true,
            'is-text-to-speech-button-enabled': false,
            'setup-ecosystem-before-start': false,
            'should-display-new-analysis-page': false,
            'show-new-result-page': false,
            'is-v3-certification-page-enabled': false,
          },
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.deep.equal(expectedData);
    });
  });
});
