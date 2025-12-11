import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import Login from 'pix-orga/templates/authentication/oidc/login';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Template | Authentication | OIDC | login', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it displays the login template with invitation banner and form component', async function (assert) {
    // given
    const controller = {
      currentInvitation: {
        invitationId: 1,
        code: 'ABC123',
        organizationName: 'Organisation OIDC',
      },
    };

    // when
    const screen = await render(<template><Login @controller={{controller}} /></template>);

    // then
    assert
      .dom(
        screen.getByText(
          t('pages.login.join-invitation', {
            organizationName: controller.currentInvitation.organizationName,
          }),
        ),
      )
      .exists();
    assert
      .dom(
        screen.getByRole('heading', {
          name: `${t('pages.oidc.login.title')}`,
        }),
      )
      .exists();
    assert
      .dom(
        screen.getByRole('heading', {
          name: `${t('pages.oidc.login.sub-title')}`,
        }),
      )
      .exists();
    assert.dom(screen.getByRole('textbox', { name: t('pages.login-form.email.label') })).exists();
    assert.dom(screen.getByLabelText(t('pages.login-form.password'))).exists();
    assert.dom(screen.getByRole('button', { name: t('pages.login-form.login') })).exists();
  });
});
