import { render } from '@1024pix/ember-testing-library';
import EmberObject from '@ember/object';
import { t } from 'ember-intl/test-support';
import HeadInformation from 'pix-admin/components/networks/head-information';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Networks | head-information', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('display', function () {
    test('it should display network informations', async function (assert) {
      // given
      const network = EmberObject.create({ id: 1, name: 'My network' });

      // when
      const screen = await render(<template><HeadInformation @network={{network}} /></template>);

      // then
      assert.dom(screen.getByRole('heading', { name: 'My network' })).exists();
      assert.dom(screen.getByText((_, element) => element.textContent === 'ID : 1')).exists();
      assert.dom(screen.getByRole('button', { name: t('components.networks.copy-id') })).exists();
    });
  });
});
