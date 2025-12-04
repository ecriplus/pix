import { render } from '@1024pix/ember-testing-library';
import HabilitationTag from 'pix-admin/components/certification-centers/habilitation-tag';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | certification-centers/habilitation-tag', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display correct icon and class when center is habilitated', async function (assert) {
    // when
    const screen = await render(
      <template><HabilitationTag @active={{true}} @arialabel="habilité" @label="Test Label" /></template>,
    );

    // then
    const listItem = screen.getByLabelText('habilité');
    assert.dom(listItem).exists();
    assert.dom(listItem).hasClass('certification-center-information-display__habilitations-list--enabled');
    assert.dom(screen.getByText('Test Label')).exists();
  });

  test('it should display correct icon and class when center is not habilitated', async function (assert) {
    // when
    const screen = await render(
      <template><HabilitationTag @active={{false}} @arialabel="non habilité" @label="Test Label" /></template>,
    );

    // then
    const listItem = screen.getByLabelText('non habilité');
    assert.dom(listItem).exists();
    assert.dom(listItem).hasClass('certification-center-information-display__habilitations-list--disabled');
    assert.dom(screen.getByText('Test Label')).exists();
  });
});
