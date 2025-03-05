import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Campaign::Cards::SharedCount', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('When shouldDisplayAssessmentLabels is true', () => {
    test('it should display shared participations count card', async function (assert) {
      this.sharedCount = 10;

      const screen = await render(
        hbs`<Campaign::Cards::SharedCount @value={{this.sharedCount}} @shouldDisplayAssessmentLabels={{true}} />`,
      );

      assert.dom(screen.getByText(t('cards.submitted-count.title'))).exists();
      assert.dom(screen.getByText('10')).exists();
    });
  });

  module('When shouldDisplayAssessmentLabels is false', () => {
    test('it should display shared profiles count card', async function (assert) {
      this.sharedCount = 10;

      const screen = await render(
        hbs`<Campaign::Cards::SharedCount @value={{this.sharedCount}} @shouldDisplayAssessmentLabels={{false}} />`,
      );

      assert.dom(screen.getByText(t('cards.submitted-count.title-profiles'))).exists();
      assert.dom(screen.getByText('10'));
    });
  });
});
