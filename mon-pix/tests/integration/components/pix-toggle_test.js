import { module, test } from 'qunit';
import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';
import { find, render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | pix-toggle', function (hooks) {
  setupIntlRenderingTest(hooks);

  hooks.beforeEach(async function () {
    this.set('valueFirstLabel', 'valueFirstLabel');
    this.set('valueSecondLabel', 'valueSecondLabel');
    this.set('onToggle', function () {
      this.set('loginWithEmail', false);
    });
    this.set('isFirstOn', 'true');

    await render(
      hbs`{{pix-toggle onToggle=onToggle valueFirstLabel=valueFirstLabel valueSecondLabel=valueSecondLabel}}`
    );
  });

  test('Default Render', function (assert) {
    assert.dom(find('.pix-toggle')).exists();
  });

  test('should display the toggle with on/off span', function (assert) {
    assert.dom(find('.pix-toggle__on')).exists();
    assert.dom(find('.pix-toggle__off')).exists();
  });

  test('should display the toggle with on/off span with the correct values', function (assert) {
    assert.equal(find('.pix-toggle__on').nodeName, 'SPAN');
    assert.equal(find('.pix-toggle__off').nodeName, 'SPAN');

    assert.equal(find('.pix-toggle__on').textContent, 'valueFirstLabel');
    assert.equal(find('.pix-toggle__off').textContent, 'valueSecondLabel');
  });

  test('should change the value of toggleOn when toggle off', async function (assert) {
    await click('.pix-toggle__off');

    assert.equal(find('.pix-toggle__on').textContent, 'valueSecondLabel');
    assert.equal(find('.pix-toggle__off').textContent, 'valueFirstLabel');

    await click('.pix-toggle__off');

    assert.equal(find('.pix-toggle__on').textContent, 'valueFirstLabel');
    assert.equal(find('.pix-toggle__off').textContent, 'valueSecondLabel');
  });
});
