import { getForwardedOrigin } from '../../../../../src/identity-access-management/infrastructure/utils/network.js';
import { expect } from '../../../../test-helper.js';

describe('Unit | Identity Access Management | Infrastructure | Utils | network', function () {
  describe('#getForwardedOrigin', function () {
    context('when port is HTTP standard port 80', function () {
      it('returns an HTTP URL', async function () {
        // given
        const headers = {
          'x-forwarded-proto': 'http',
          'x-forwarded-port': '80',
          'x-forwarded-host': 'localhost',
        };

        // when
        const origin = getForwardedOrigin(headers);

        // then
        expect(origin).to.equal('http://localhost');
      });
    });

    context('when port is HTTPS standard port 443', function () {
      it('returns an HTTPS URL', async function () {
        // given
        const headers = {
          'x-forwarded-proto': 'https',
          'x-forwarded-port': '443',
          'x-forwarded-host': 'app-pr10823.review.pix.fr',
        };

        // when
        const origin = getForwardedOrigin(headers);

        // then
        expect(origin).to.equal('https://app-pr10823.review.pix.fr');
      });
    });

    context('when port is neither HTTP nor HTTPS standard ports', function () {
      it('returns an URL with a specific port', async function () {
        // given
        const headers = {
          'x-forwarded-proto': 'http',
          'x-forwarded-port': '4200',
          'x-forwarded-host': 'localhost:4200',
        };

        // when
        const origin = getForwardedOrigin(headers);

        // then
        expect(origin).to.equal('http://localhost:4200');
      });
    });

    context('when x-forwarded-proto and x-forwarded-port have multiple values (ember serve --proxy)', function () {
      it('returns an URL corresponding to the first HTTP proxy facing the user', async function () {
        // given
        const headers = {
          'x-forwarded-proto': 'https,http',
          'x-forwarded-port': '80',
          'x-forwarded-host': 'app.dev.pix.org',
        };

        // when
        const origin = getForwardedOrigin(headers);

        // then
        expect(origin).to.equal('https://app.dev.pix.org');
      });
    });

    context('when x-forwarded-proto and x-forwarded-port are not defined', function () {
      it('doesn’t choke and returns an empty string', async function () {
        // given
        const headers = {};

        // when
        const origin = getForwardedOrigin(headers);

        // then
        expect(origin).to.equal('');
      });
    });
  });
});
