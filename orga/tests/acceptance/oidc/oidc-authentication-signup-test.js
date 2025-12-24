import { visit } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { t } from 'ember-intl/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { Response } from 'miragejs';
import Location from 'pix-orga/utils/location';
import { SessionStorageEntry } from 'pix-orga/utils/session-storage-entry';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntl from '../../helpers/setup-intl';

module('Acceptance | OIDC | authentication signup', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  const invitationStorage = new SessionStorageEntry('joinInvitationData');

  hooks.beforeEach(function () {
    sinon.stub(Location, 'assign');

    invitationStorage.set({ invitationId: '123', code: 'ABC', organizationName: 'Super orga avec SSO' });
  });

  hooks.afterEach(function () {
    Location.assign.restore();
    invitationStorage.remove();
  });

  test('the user signs up', async function (assert) {
    // given
    const screen = await visit('/connexion/oidc-partner?code=code&state=state');

    // when
    const loginTitle = await screen.findByRole('heading', { name: t('pages.oidc.login.title') });
    assert.dom(loginTitle).exists();

    const signupButton = await screen.findByRole('link', { name: t('pages.oidc.login.signup-button') });
    await click(signupButton);

    // then
    const signUpTitle = await screen.findByRole('heading', { name: t('pages.oidc.signup.title') });
    assert.dom(signUpTitle).exists();

    const invitationText = await screen.findByText(
      t('pages.login.join-invitation', { organizationName: 'Super orga avec SSO' }),
    );
    assert.dom(invitationText).exists();

    const firstName = await screen.findByText(
      t('pages.oidc.signup.claims.first-name-label-and-value', { firstName: 'test' }),
    );
    const lastName = await screen.findByText(
      t('pages.oidc.signup.claims.last-name-label-and-value', { lastName: 'PIX' }),
    );
    assert.dom(firstName).exists();
    assert.dom(lastName).exists();
  });

  module('When there are no user claims returned by the identity provider', function () {
    test('displays claim error message', async function (assert) {
      // given
      this.server.post('/oidc/token', () => {
        return new Response(
          401,
          {},
          {
            errors: [
              {
                code: 'SHOULD_VALIDATE_CGU',
                meta: { authenticationKey: 'key', userClaims: null },
              },
            ],
          },
        );
      });

      const screen = await visit('/connexion/oidc-partner?code=code&state=state');

      // when
      const loginTitle = await screen.findByRole('heading', { name: t('pages.oidc.login.title') });
      assert.dom(loginTitle).exists();

      const signupButton = await screen.findByRole('link', { name: t('pages.oidc.login.signup-button') });
      await click(signupButton);

      // then
      const signUpTitle = await screen.findByRole('heading', { name: t('pages.oidc.signup.title') });
      assert.dom(signUpTitle).exists();

      const claimErrorMessage = await screen.findByText(t('pages.oidc.signup.error'));
      assert.dom(claimErrorMessage).exists();
    });
  });
});
