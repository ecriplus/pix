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
    const icon = listItem.querySelector('.pix-icon');
    assert.dom(icon).hasClass('habilitation-icon--granted');
    assert.dom(icon).hasClass('habilitation-icon');
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
    const icon = listItem.querySelector('.pix-icon');
    assert.dom(icon).hasClass('habilitation-icon--non-granted');
    assert.dom(icon).hasClass('habilitation-icon');
    assert.dom(screen.getByText('Test Label')).exists();
  });

  test('it should have the correct base class in both cases', async function (assert) {
    // when active
    const screenActive = await render(
      <template><HabilitationTag @active={{true}} @arialabel="habilité" @label="Active" /></template>,
    );
    const iconActive = screenActive.getByLabelText('habilité').querySelector('.pix-icon');
    assert.dom(iconActive).hasClass('habilitation-icon');

    // when not active
    const screenInactive = await render(
      <template><HabilitationTag @active={{false}} @arialabel="non habilité" @label="Inactive" /></template>,
    );
    const iconInactive = screenInactive.getByLabelText('non habilité').querySelector('.pix-icon');
    assert.dom(iconInactive).hasClass('habilitation-icon');
  });
});
