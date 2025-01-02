import {render} from '@1024pix/ember-testing-library';
import Issue from 'junior/components/issue';
import {module, test} from 'qunit';

import setupIntlRenderingTest from '../helpers';

module('Integration | Component | Issue', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display a given message', async function (assert) {
    // given
    const message = 'Message from the wonderful robot !';
    // when
    const screen = await render(<template><Issue @message={{message}} /></template>);

    assert.dom(screen.getByText(message)).exists();
  });

  test('should display multiple messages', async function (assert) {
    // given
    const message = ['Message from the wonderful robot !', 'Super 2e message.', 'Super 3e Message'];
    // when
    const screen = await render(<template><Issue @message={{message}} /></template>);
    assert.dom(screen.getByText(message[0])).exists();
    assert.dom(screen.getByText(message[1])).exists();
    assert.dom(screen.getByText(message[2])).exists();
  });
});
