import { render } from '@1024pix/ember-testing-library';
import QabScoreCard from 'mon-pix/components/module/element/qab/qab-score-card';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | QabScoreCard', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display a title and the score', async function (assert) {
    // given
    const score = 4;
    const total = 5;

    // when
    const screen = await render(<template><QabScoreCard @score={{score}} @total={{total}} /></template>);

    // then
    assert.dom(screen.getByRole('heading', { name: 'Série terminée', level: 4 })).exists();
    assert.dom(screen.getByText('Votre score : 4/5')).exists();
  });
});
