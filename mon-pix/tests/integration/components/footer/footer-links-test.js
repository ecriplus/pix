import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Footer', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('displays a navigation with a list of links', async function (assert) {
    // when
    const screen = await render(hbs`<Footer::FooterLinks />`);

    // then
    assert.dom(screen.getByRole('navigation')).hasAttribute('aria-label', t('navigation.footer.label'));

    assert.ok(screen.getByRole('link', { name: t('navigation.footer.help-center') }));
    assert.ok(screen.getByRole('link', { name: t('navigation.footer.a11y') }));
    assert.ok(screen.getByRole('link', { name: t('navigation.footer.server-status') }));
    assert.ok(screen.getByRole('link', { name: t('navigation.footer.eula') }));
    assert.ok(screen.getByRole('link', { name: t('navigation.footer.legal-notice') }));
    assert.ok(screen.getByRole('link', { name: t('navigation.footer.data-protection-policy') }));
  });

  module('when user is connected', function (hooks) {
    hooks.beforeEach(function () {
      class CurrentUserStub extends Service {
        user = { fullName: 'John Doe' };
      }

      this.owner.register('service:currentUser', CurrentUserStub);
    });

    test('displays the sitemap link', async function (assert) {
      // when
      const screen = await render(hbs`<Footer::FooterLinks />`);

      // then
      assert.ok(screen.getByRole('link', { name: t('navigation.footer.sitemap') }));
    });
  });

  module('when url does not have frenchDomainExtension', function (hooks) {
    hooks.beforeEach(function () {
      class CurrentDomainServiceStub extends Service {
        get isFranceDomain() {
          return false;
        }
      }

      this.owner.register('service:currentDomain', CurrentDomainServiceStub);
    });

    test('does not display the student data policy', async function (assert) {
      // when
      const screen = await render(hbs`<Footer />}`);

      // then
      assert
        .dom(screen.queryByRole('link', { name: t('navigation.footer.student-data-protection-policy') }))
        .doesNotExist();
    });
  });

  module('when url has frenchDomainExtension', function (hooks) {
    hooks.beforeEach(function () {
      class CurrentDomainServiceStub extends Service {
        get isFranceDomain() {
          return true;
        }
      }

      this.owner.register('service:currentDomain', CurrentDomainServiceStub);
    });

    test('displays the student data policy', async function (assert) {
      // when
      const screen = await render(hbs`<Footer />}`);

      // then
      assert.dom(screen.getByRole('link', { name: t('navigation.footer.student-data-protection-policy') })).exists();
    });
  });
});
