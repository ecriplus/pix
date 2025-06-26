import { render } from '@1024pix/ember-testing-library';
import StateTag from 'pix-admin/components/trainings/state-tag';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Trainings::StateTag', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('When isDisabled is true', function () {
    test('should display "En pause" with error color', async function (assert) {
      // when
      const screen = await render(<template><StateTag @isDisabled={{true}} /></template>);

      // then
      assert.dom(screen.getByText('En pause')).exists();
      assert.dom(screen.getByText('En pause')).hasClass('pix-tag--error');
    });
  });

  module('When isDisabled is false', function () {
    test('should display "Actif" with primary color', async function (assert) {
      // when
      const screen = await render(<template><StateTag @isDisabled={{false}} /></template>);

      // then
      assert.dom(screen.getByText('Actif')).exists();
      assert.dom(screen.getByText('Actif')).hasClass('pix-tag--primary');
    });
  });

  module('When isDisabled is not provided', function () {
    test('should display "Actif" with primary color as default', async function (assert) {
      // when
      const screen = await render(<template><StateTag /></template>);

      // then
      assert.dom(screen.getByText('Actif')).exists();
      assert.dom(screen.getByText('Actif')).hasClass('pix-tag--primary');
    });
  });
});
