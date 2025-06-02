import { render } from '@1024pix/ember-testing-library';
import QabScoreCard from 'mon-pix/components/module/element/qab/qab-score-card';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | QabScoreCard', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display the score and a retry button', async function (assert) {
    // given
    const score = 4;
    const total = 5;

    // when
    const screen = await render(<template><QabScoreCard @score={{score}} @total={{total}} /></template>);

    // then
    assert.dom(screen.getByRole('heading', { name: 'Votre score : 4/5' })).exists();
    assert.dom(screen.getByRole('button', { name: 'Réessayer' })).exists();
  });

  module('when user clicks the retry button', function () {
    test('should call the onRetry callback', async function (assert) {
      // given
      const onRetry = sinon.stub();
      const screen = await render(<template><QabScoreCard @score={{4}} @total={{5}} @onRetry={{onRetry}} /></template>);

      // when
      await screen.getByRole('button', { name: 'Réessayer' }).click();

      // then
      assert.ok(onRetry.calledOnce);
    });
  });
});
