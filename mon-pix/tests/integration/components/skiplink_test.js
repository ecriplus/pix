import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { contains } from '../../helpers/contains';
import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Integration | Component | Skip Link', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('displays supplied label and links to the correct anchor', async function (assert) {
    await render(hbs`<Skiplink @href="#anchor-link" @label="go-to-link" />`);

    assert.dom(contains('go-to-link')).exists();

    const skipLink = this.element.getElementsByClassName('skip-link')[0];
    assert.dom(skipLink.href).hasValue('#anchor-link');
  });
});
