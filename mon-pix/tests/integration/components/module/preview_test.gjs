import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import ModulixPreview from 'mon-pix/components/module/preview';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | Preview', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display a link to Modulix Editor', async function (assert) {
    // given
    const expectedUrl = 'https://1024pix.github.io/modulix-editor/';
    const linkName = 'Modulix Editor';

    //  when
    const screen = await render(<template><ModulixPreview /></template>);

    // then
    const linkToModulixEditor = screen.getByRole('link', { name: linkName });
    assert.dom(linkToModulixEditor).exists();
    assert.strictEqual(linkToModulixEditor.href, expectedUrl);
  });

  test('should hide json textarea by default', async function (assert) {
    //  when
    const screen = await render(<template><ModulixPreview /></template>);

    // then
    assert.dom(screen.queryByRole('textbox', { name: 'Contenu du Module' })).doesNotExist();
  });


});
