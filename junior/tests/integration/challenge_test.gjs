import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import { setupRenderingTest } from '../helpers';
import { module, test } from 'qunit';
import Challenge from 'junior/components/challenge/challenge';

module('Integration | Component | Challenge', function (hooks) {
  setupRenderingTest(hooks);

  module('if learner has oralization feature', function () {
    test('should display oralization buttons on instruction bubbles', async function (assert) {
      const challenge = { instructions: ['1ère instruction', '2ème instruction'] };
      const screen = await render(
        <template><Challenge @challenge={{challenge}} @oralization={{true}} /></template>,
      );

      assert.strictEqual(screen.getAllByText(t('components.oralization-button.play')).length, 2);
    });
  });
  module('if learner has not oralization feature', function () {
    test('should not display oralization buttons', async function (assert) {
      const store = this.owner.lookup('service:store');
      store.createRecord('organization-learner', { features: [] });
      const challenge = { instructions: ['1ère instruction', '2ème instruction'] };
      const screen = await render(
        <template><Challenge @challenge={{challenge}} @oralization={{false}} /></template>,
      );

      assert.dom(screen.queryByText(t('components.oralization-button.play'))).doesNotExist();
    });
  });
});
