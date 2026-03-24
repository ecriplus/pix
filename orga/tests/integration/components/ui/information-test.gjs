import { render } from '@1024pix/ember-testing-library';
import Information from 'pix-orga/components/ui/information';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Ui | Information', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('label', function () {
    test('it the title and the content givent', async function (assert) {
      const title = 'Title';
      const content = 'Content';

      const screen = await render(
        <template>
          <Information>
            <:title>{{title}}</:title>
            <:content>{{content}}</:content>
          </Information>
        </template>,
      );

      assert.ok(screen.getByText(title));
      assert.ok(screen.getByText(content));
    });
  });
});
