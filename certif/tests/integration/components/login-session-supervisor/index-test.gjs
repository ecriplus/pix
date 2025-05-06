import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import LoginSessionSupervisor from 'pix-certif/components/login-session-supervisor';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Login session supervisor', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should render supervisor login page', async function (assert) {
    // given
    const authenticateSupervisor = sinon.stub();
    const currentUserEmail = 'lara.pafromage@example.net';

    // when
    const screen = await render(
      <template>
        <LoginSessionSupervisor
          @authenticateSupervisor={{authenticateSupervisor}}
          @currentUserEmail={{currentUserEmail}}
        />
      </template>,
    );

    // then
    assert
      .dom(screen.getByRole('heading', { level: 1, name: t('pages.session-supervising.login.form.title') }))
      .exists();
    assert
      .dom(screen.getByRole('heading', { level: 2, name: t('pages.session-supervising.login.form.sub-title') }))
      .exists();
    assert.dom(screen.getByText(t('common.form-errors.mandatory-all-fields'))).exists();
    assert.dom(screen.getByRole('form')).exists();
    assert.dom(screen.getByText(currentUserEmail)).exists();
    assert
      .dom(screen.getByRole('link', { name: t('pages.session-supervising.login.form.actions.switch-account') }))
      .exists();
  });
});
