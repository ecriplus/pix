import { render } from '@1024pix/ember-testing-library';
import MaximumPlacesExceeded from 'pix-orga/components/banner/maximum-places-exceeded';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Banner | Maximum places exceeded', function (hooks) {
  setupIntlRenderingTest(hooks);

  let store;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
    this.intl = this.owner.lookup('service:intl');
  });

  module('when places feature is disabled', function () {
    test('it should not display a banner', async function (assert) {
      // when
      const screen = await render(<template><MaximumPlacesExceeded /></template>);

      // then
      assert.notOk(screen.queryByText(this.intl.t('banners.maximum-places-exceeded.message')));
    });
  });

  module('when places feature is enabled', function () {
    module('when maximum places is not reached', function () {
      test('it should not display a banner', async function (assert) {
        // given
        store.createRecord('organization-place-statistic', { hasReachedMaximumPlacesLimit: false });

        // when
        const screen = await render(<template><MaximumPlacesExceeded /></template>);

        // then
        assert.notOk(screen.queryByText(this.intl.t('banners.maximum-places-exceeded.message')));
      });
    });

    module('when maximum places is reached', function () {
      test('it should display a banner', async function (assert) {
        // given
        store.createRecord('organization-place-statistic', { hasReachedMaximumPlacesLimit: true });

        // when
        const screen = await render(<template><MaximumPlacesExceeded /></template>);

        // then
        assert.ok(screen.getByText(this.intl.t('banners.maximum-places-exceeded.message')));
      });
    });
  });
});
