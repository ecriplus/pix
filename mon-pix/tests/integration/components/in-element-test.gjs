import { render } from '@1024pix/ember-testing-library';
import { setupRenderingTest } from 'ember-qunit';
import InElement from 'mon-pix/components/in-element';
import { module, test } from 'qunit';

module('Integration | Component | In Element', function (hooks) {
  setupRenderingTest(hooks);

  test('should found the id and renders', async function (assert) {
    const text = 'Coucou le chat';
    const screen = await render(
      <template>
        <div id="ninja"></div>
        <InElement @destinationId="ninja">{{text}}</InElement>
      </template>,
    );

    assert.dom(screen.getByText(text)).exists();
  });

  test('should wait if the element does not exists yet', async function (assert) {
    const text = 'Coucou le chat';
    const screen = await render(
      <template>
        <InElement @destinationId="ninja" @waitForElement={{true}}>{{text}}</InElement>
        <div id="ninja"></div>
      </template>,
    );

    // then
    assert.dom(screen.getByText(text)).exists();
  });
});
