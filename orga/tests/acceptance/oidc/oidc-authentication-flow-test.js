import { visit } from '@1024pix/ember-testing-library';
import { click, currentURL, fillIn, settled } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { t } from 'ember-intl/test-support';
import { setupApplicationTest } from 'ember-qunit';
import Location from 'pix-orga/utils/location';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntl from '../../helpers/setup-intl';
import { unabortedVisit } from '../../helpers/unaborted-visit';

module('Acceptance | OIDC | authentication flow', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    sinon.stub(Location, 'assign');
  });

  hooks.afterEach(function () {
    Location.assign.restore();
  });

  module('when the user has not performed an authentication to the OIDC Provider', function () {
    module('when the wanted OIDC Provider is not enabled/ready/existing', function () {
      test('it redirects the user to the login page', async function (assert) {
        // when
        await unabortedVisit('/connexion/some-oidc-provider-not-enabled-ready-existing');

        // then
        assert.strictEqual(currentURL(), '/connexion');
      });
    });

    module('when the wanted OIDC Provider is enabled and ready', function () {
      test('it redirects the user to the OIDC provider authentication page', async function (assert) {
        // when
        await unabortedVisit('/connexion/oidc-partner');

        // then
        assert.ok(Location.assign.calledWith('https://oidc/connexion/oauth2/authorize'));
      });
    });
  });

  module('when the user has performed an authentication to the OIDC Provider', function () {
    module('when the wanted OIDC Provider is not enabled/ready/existing', function () {
      test('it redirects the user to the login page', async function (assert) {
        // when
        await unabortedVisit('/connexion/some-oidc-provider-not-enabled-ready-existing?code=code&state=state');

        // then
        assert.strictEqual(currentURL(), '/connexion');
      });
    });

    module('when the wanted OIDC Provider is enabled and ready', function () {
      test('it redirects the user to the SSO login page', async function (assert) {
        // when
        await unabortedVisit('/connexion/oidc-partner?code=code&state=state');

        // then
        assert.strictEqual(currentURL(), '/connexion/oidc-partner/login');
      });

      module('when the Pix account exists and the password is correct', function () {
        test('the login form redirects to the OIDC association confirmation page', async function (assert) {
          // given
          server.create('user', {
            email: 'lloyd.ce@example.net',
            password: 'pix123',
            cgu: true,
            mustValidateTermsOfService: false,
            lastTermsOfServiceValidatedAt: new Date(),
          });
          const screen = await visit('/connexion/oidc-partner?code=code&state=state');

          // when
          await fillIn(
            screen.getByRole('textbox', { name: t('pages.login-form.email.label') }),
            'lloyd.ce@example.net',
          );
          await fillIn(screen.getByLabelText(t('pages.login-form.password')), 'pix123');

          await click(screen.getByRole('button', { name: t('pages.login-form.login') }));
          // eslint-disable-next-line ember/no-settled-after-test-helper
          await settled();

          // then
          assert.ok(
            screen.getByRole('heading', {
              name: `${t('components.authentication.oidc-association-confirmation.title')}`,
            }),
          );
          assert.ok(screen.getByText(t('components.authentication.oidc-association-confirmation.email')));
          assert.ok(screen.getByText('lloyd.ce@example.net'));
          assert.ok(
            screen.getByText(t('components.authentication.oidc-association-confirmation.authentication-method-to-add')),
          );
          assert.ok(
            screen.getByText(
              `${t('components.authentication.oidc-association-confirmation.external-connection-via')} Partenaire OIDC`,
            ),
          );
          assert.ok(screen.getByText('LLoyd Idp'));
        });
      });

      module('when the Pix account does not exist or the password is incorrect', function () {
        test('the login form displays a missing or invalid credentials error message', async function (assert) {
          // given
          this.server.post(
            '/oidc/user/check-reconciliation',
            {
              errors: [
                {
                  status: '401',
                  code: 'MISSING_OR_INVALID_CREDENTIALS',
                  title: 'Unauthorized',
                  detail: 'Missing or invalid credentials',
                  meta: { isLoginFailureWithUsername: false },
                },
              ],
            },
            401,
          );
          const screen = await visit('/connexion/oidc-partner?code=code&state=state');

          // when
          await fillIn(
            screen.getByRole('textbox', { name: t('pages.login-form.email.label') }),
            'no-account-with-this-email@example.net',
          );
          await fillIn(screen.getByLabelText(t('pages.login-form.password')), 'incorrect-password');

          await click(screen.getByRole('button', { name: t('pages.login-form.login') }));
          // eslint-disable-next-line ember/no-settled-after-test-helper
          await settled();

          // then
          assert.ok(screen.getByText(t('common.api-error-messages.login-unauthorized-error')));
        });
      });

      module('when there is an unexpected error', function () {
        test('the login form displays a generic error message', async function (assert) {
          // given
          this.server.post('/oidc/user/check-reconciliation', undefined, 500);

          const screen = await visit('/connexion/oidc-partner?code=code&state=state');

          // when
          await fillIn(
            screen.getByRole('textbox', { name: t('pages.login-form.email.label') }),
            'no-account-with-this-email@example.net',
          );
          await fillIn(screen.getByLabelText(t('pages.login-form.password')), 'incorrect-password');

          await click(screen.getByRole('button', { name: t('pages.login-form.login') }));
          // eslint-disable-next-line ember/no-settled-after-test-helper
          await settled();

          // Translation common.api-error-messages.login-unexpected-error contains HTML
          // assert.ok(screen.getByText(t('common.api-error-messages.login-unexpected-error')));
          assert.ok(screen.getByText(new RegExp('Impossible de se connecter.')));
        });
      });
    });
  });

  // TODO: Uncomment and make those tests work when the signup template is done
  //   module('when the user logs out', function () {
  //     toRenameToTest('it redirects the user to the logout URL', async function (assert) {
  //       // given
  //       const screen = await visit('/connexion/oidc-partner?code=code&state=state');
  //       await click(screen.getByLabelText(t('common.cgu.label')));
  //       await click(screen.getByRole('button', { name: 'Je crée mon compte' }));
  //       // eslint-disable-next-line ember/no-settled-after-test-helper
  //       await settled();
  //
  //       await click(screen.getByRole('button', { name: 'Lloyd Consulter mes informations' }));
  //
  //       // when
  //       await click(screen.getByRole('link', { name: 'Se déconnecter' }));
  //
  //       // then
  //       assert.strictEqual(currentURL(), '/deconnexion');
  //     });
  //   });
});
