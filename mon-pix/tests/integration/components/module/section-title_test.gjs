import { render } from '@1024pix/ember-testing-library';
import ModuleSectionTitle from 'mon-pix/components/module/section-title';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | Section title', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display a section title', async function (assert) {
    // given
    const sectionType = 'practise';

    // when
    const screen = await render(<template><ModuleSectionTitle @sectionType={{sectionType}} /></template>);

    // then
    assert.dom(screen.getByRole('heading', { name: 'S’exercer', level: 2 })).exists();
  });
});
