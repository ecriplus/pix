import { render } from '@1024pix/ember-testing-library';
import { setupRenderingTest } from 'ember-qunit';
import focus from 'pix-admin/modifiers/focus';
import { module, test } from 'qunit';

module('Integration | Modifiers | focus', function (hooks) {
  setupRenderingTest(hooks);

  test('it should focus the item', async function (assert) {
    // when
    const screen = await render(
      <template>
        <label>Pas Focus<input placeholder="Je suis pas focus" /></label>
        <label>Focus<input placeholder="Je suis focus" {{focus}} /></label>
      </template>,
    );

    // then
    const focusedElement = document.activeElement;
    assert.deepEqual(focusedElement, screen.getByPlaceholderText('Je suis focus'));
  });
});
