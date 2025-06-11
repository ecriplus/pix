import { config } from '../../../../../src/shared/config.js';
import { urlBuilder } from '../../../../../src/shared/infrastructure/utils/url-builder.js';
import { expect } from '../../../../test-helper.js';

describe('Unit | Shared | Infrastructure | Utils | url-builder', function () {
  describe('#getPixAppBaseUrl', function () {
    it('returns base url fr if locale not defined', function () {
      // when
      const url = urlBuilder.getPixAppBaseUrl();
      // then
      expect(url).to.equal(`${config.domain.pixApp + config.domain.tldFr}`);
    });

    it('returns base url fr if locale is fr-FR', function () {
      // when
      const url = urlBuilder.getPixAppBaseUrl('fr-FR');
      // then
      expect(url).to.equal(`${config.domain.pixApp + config.domain.tldFr}`);
    });

    it('returns base url fr if locale is not supported', function () {
      // when
      const url = urlBuilder.getPixAppBaseUrl('ru');
      // then
      expect(url).to.equal(`${config.domain.pixApp + config.domain.tldFr}`);
    });

    it('returns base url org if locale is in supported locales and not fr-FR', function () {
      // when
      const url = urlBuilder.getPixAppBaseUrl('fr');
      // then
      expect(url).to.equal(`${config.domain.pixApp + config.domain.tldOrg}`);
    });
  });

  describe('getEmailValidationUrl', function () {
    context('when locale is given', function () {
      it('returns email validation URL with domain .org', function () {
        // given
        const token = '00000000-0000-0000-0000-000000000000';
        const redirectUrl = 'https://app.pix.org/connexion?lang=nl';
        const locale = 'en';
        const expectedParams = new URLSearchParams({ token, redirect_url: redirectUrl });

        // when
        const url = urlBuilder.getEmailValidationUrl({ locale, redirectUrl, token });

        // then
        expect(url).to.equal(
          `${config.domain.pixApp + config.domain.tldOrg}/api/users/validate-email?${expectedParams.toString()}`,
        );
      });
    });

    context('when locale is not given', function () {
      it('returns email validation URL with domain .fr', function () {
        // given
        const token = '00000000-0000-0000-0000-000000000000';
        const redirectUrl = 'https://app.pix.fr/connexion';
        const expectedParams = new URLSearchParams({ token, redirect_url: redirectUrl });

        // when
        const url = urlBuilder.getEmailValidationUrl({ redirectUrl, token });

        // then
        expect(url).to.equal(
          `${config.domain.pixApp + config.domain.tldFr}/api/users/validate-email?${expectedParams.toString()}`,
        );
      });
    });

    context('when token is not given', function () {
      it('returns email validation URL with domain .fr', function () {
        // given
        const redirectUrl = 'https://app.pix.fr/connexion';

        // when
        const url = urlBuilder.getEmailValidationUrl({ redirectUrl });

        // then
        expect(url).to.equal(redirectUrl);
      });
    });

    context('when redirect_url is not given', function () {
      it('returns email validation URL with domain .fr', function () {
        // given
        const token = '00000000-0000-0000-0000-000000000000';

        // when
        const url = urlBuilder.getEmailValidationUrl({ token });

        // then
        expect(url).to.equal(`${config.domain.pixApp + config.domain.tldFr}/api/users/validate-email?token=${token}`);
      });
    });
  });
});
