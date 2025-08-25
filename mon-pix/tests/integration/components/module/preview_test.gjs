import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
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

  test('should display json textarea on button click', async function (assert) {
    //  given
    const screen = await render(<template><ModulixPreview /></template>);
    const button = screen.getByRole('button', { name: 'Afficher le JSON' });

    // when
    await click(button);

    // then
    assert.dom(screen.queryByRole('textbox', { name: 'Contenu du Module' })).exists();
  });

  module('when previewing an existing module passed as argument', function () {
    test('should display the module title', async function (assert) {
      // given
      const moduleData = { title: 'Existing module' };
      const screen = await render(<template><ModulixPreview @module={{moduleData}} /></template>);

      // then
      assert.dom(screen.getByRole('heading', { name: 'Existing module' })).exists();
    });

    test('should not display the navbar', async function (assert) {
      // given
      const moduleData = { title: 'Existing module' };
      const screen = await render(<template><ModulixPreview @module={{moduleData}} /></template>);

      // then
      const linkToModulixEditor = screen.queryByRole('link', { name: 'Modulix Editor' });
      assert.dom(linkToModulixEditor).doesNotExist();
      const displayJsonButton = screen.queryByRole('button', { name: 'Afficher le JSON' });
      assert.dom(displayJsonButton).doesNotExist();
    });

    module('when has a section', function () {
      module('when section is type "blank"', function () {
        test('should not display section title', async function (assert) {
          // given
          const moduleData = { title: 'Existing module', sections: [{ type: 'blank' }] };
          const screen = await render(<template><ModulixPreview @module={{moduleData}} /></template>);

          // then
          const h2 = screen.queryByRole('heading', { level: 2 });
          assert.dom(h2).doesNotExist();
        });
      });

      module('when section is type "question-yourself"', function () {
        test('should display section title', async function (assert) {
          // given
          const moduleData = {
            title: 'Existing module',
            sections: [{ type: 'question-yourself' }],
          };
          const screen = await render(<template><ModulixPreview @module={{moduleData}} /></template>);

          // then
          const h2 = screen.queryByRole('heading', {
            level: 2,
            name: t(`pages.modulix.section.${moduleData.sections[0].type}`),
          });
          assert.dom(h2).exists();
        });
      });

      module('when section is type "practise"', function () {
        test('should display section title', async function (assert) {
          // given
          const moduleData = {
            title: 'Existing module',
            sections: [{ type: 'practise' }],
          };
          const screen = await render(<template><ModulixPreview @module={{moduleData}} /></template>);

          // then
          const h2 = screen.queryByRole('heading', {
            level: 2,
            name: t(`pages.modulix.section.${moduleData.sections[0].type}`),
          });
          assert.dom(h2).exists();
        });
      });
    });
  });
});
