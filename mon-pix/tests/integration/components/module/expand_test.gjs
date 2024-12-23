import { render } from '@1024pix/ember-testing-library';
import ModulixExpandElement from 'mon-pix/components/module/element/expand';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | Expand', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display the title of an expand', async function (assert) {
    // given
    const content = 'My content';
    const expandElement = {
      title: 'Expand title',
      content: `<p>${content}</p>`,
    };

    //  when
    const screen = await render(<template><ModulixExpandElement @expand={{expandElement}} /></template>);

    // then
    const detailsElement = screen.getByRole('group');
    assert.dom(detailsElement).exists();
    assert.dom(screen.getByText(expandElement.title)).exists();
    assert.dom(screen.getByText(content)).exists();
  });
});
