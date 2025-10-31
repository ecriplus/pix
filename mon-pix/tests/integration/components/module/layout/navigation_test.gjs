import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import ModulixNavigation from 'mon-pix/components/module/layout/navigation';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | Navigation', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when current section is second section', function () {
    test('should set aria-current attribute to the second NavigationButton element', async function (assert) {
      // given
      const modulixNavigationProgressService = this.owner.lookup('service:modulix-navigation-progress');
      modulixNavigationProgressService.setCurrentSectionIndex(1);
      const sections = [
        {
          type: 'question-yourself',
        },
        {
          type: 'explore-to-understand',
        },
        {
          type: 'retain-the-essentials',
        },
        {
          type: 'practise',
        },
        {
          type: 'go-further',
        },
      ];

      // when
      const screen = await render(<template><ModulixNavigation @sections={{sections}} /></template>);

      // then
      assert
        .dom(await screen.findByRole('button', { name: t('pages.modulix.section.explore-to-understand') }))
        .hasAria('current', 'true');
      assert
        .dom(screen.getByRole('button', { name: t('pages.modulix.section.question-yourself') }))
        .hasAria('current', 'false');
    });
  });
});
