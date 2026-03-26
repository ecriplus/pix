import { render } from '@1024pix/ember-testing-library';
import InformationWrapper from 'pix-orga/components/ui/information-wrapper';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Ui | Information Wrapper', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('yield', function () {
    test('should display yield content', async function (assert) {
      const screen = await render(
        <template>
          <InformationWrapper> toto </InformationWrapper>
        </template>,
      );

      assert.ok(screen.getByText('toto'));
    });
  });
});
