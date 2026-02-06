import { render } from '@1024pix/ember-testing-library';
import Login from 'pix-orga/templates/authentication/login';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Template | Authentication | login', function (hooks) {
  setupIntlRenderingTest(hooks);

  let domainService;

  hooks.beforeEach(function () {
    domainService = this.owner.lookup('service:currentDomain');
  });

  module('when domain is pix.org', function () {
    test('does not display recovery link', async function (assert) {
      // given
      const controller = this.owner.lookup('controller:authentication/login');
      sinon.stub(domainService, 'getExtension').returns('org');

      // when
      await render(<template><Login @controller={{controller}} /></template>);

      // then
      assert.dom('.authentication-login-form__recover-access__question').doesNotExist();
      assert.dom('.authentication-login-form__recover-access .link--underlined').doesNotExist();
    });
  });

  module('when domain is pix.fr', function () {
    test('displays recovery link', async function (assert) {
      // given
      const controller = this.owner.lookup('controller:authentication/login');
      sinon.stub(domainService, 'getExtension').returns('fr');

      // when
      await render(<template><Login @controller={{controller}} /></template>);

      // then
      assert.dom('.authentication-login__recover-access__question').exists();
      assert.dom('.authentication-login__recover-access .link--underlined').exists();
    });
  });
});
