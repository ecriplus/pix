import { render } from '@1024pix/ember-testing-library';
import MaximumPlacesExceeded from 'pix-orga/components/banner/maximum-places-exceeded';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Banner | Maximum places exceeded', function (hooks) {
  setupIntlRenderingTest(hooks);
  let currentUser;
  hooks.beforeEach(function () {
    currentUser = this.owner.lookup('service:current-user');
    this.intl = this.owner.lookup('service:intl');
  });

  module('when places feature is disabled', function () {
    test('it should not display a banner', async function (assert) {
      // when
      const screen = await render(<template><MaximumPlacesExceeded /></template>);

      // then
      assert.notOk(screen.queryByText("Votre organisation n'a plus de places disponibles !"));
    });
  });

  module('when places feature is enabled', function () {
    module('when maximum places is not reached', function () {
      test('it should not display a banner', async function (assert) {
        // given
        sinon.stub(currentUser, 'organizationPlaceStatistics').value({ hasReachedMaximumPlacesLimit: false });

        // when
        const screen = await render(<template><MaximumPlacesExceeded /></template>);

        // then
        assert.notOk(screen.queryByText("Votre organisation n'a plus de places disponibles !"));
      });
    });

    module('when maximum places is reached', function () {
      test('it should display a banner', async function (assert) {
        // given
        sinon.stub(currentUser, 'organizationPlaceStatistics').value({ hasReachedMaximumPlacesLimit: true });

        // when
        const screen = await render(<template><MaximumPlacesExceeded /></template>);

        // then
        assert.ok(screen.getByText("Votre organisation n'a plus de places disponibles !"));
      });
    });
  });
});
