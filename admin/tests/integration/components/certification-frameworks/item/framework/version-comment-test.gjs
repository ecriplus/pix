import { render } from '@1024pix/ember-testing-library';
import VersionComment from 'pix-admin/components/certification-frameworks/item/framework/version-comment';
import { module, test } from 'qunit';

import setupIntlRenderingTest, { t } from '../../../../../helpers/setup-intl-rendering';

module('Integration | Component | Complementary certifications/Item/Framework | Version comment', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it renders a textarea with maxlength', async function (assert) {
    // given
    const version = { comment: '' };

    // when
    const screen = await render(<template><VersionComment @version={{version}} /></template>);

    // then
    assert.dom(screen.getByRole('textbox')).exists();
    assert.dom(screen.getByRole('textbox')).hasAttribute('maxlength', '200');
  });

  test('it initializes textarea with existing version comment', async function (assert) {
    // given
    const version = { comment: 'Un commentaire existant' };

    // when
    const screen = await render(<template><VersionComment @version={{version}} /></template>);

    // then
    assert.dom(screen.getByRole('textbox')).hasValue('Un commentaire existant');
  });

  test('it renders the save button', async function (assert) {
    // given
    const version = { comment: '' };

    // when
    const screen = await render(<template><VersionComment @version={{version}} /></template>);

    // then
    assert.dom(screen.getByRole('button', { name: t('common.actions.save') })).exists();
  });
});
