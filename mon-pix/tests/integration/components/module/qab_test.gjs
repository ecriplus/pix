import { render } from '@1024pix/ember-testing-library';
import ModuleQabElement from 'mon-pix/components/module/element/qab/qab';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | QAB', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display a QAB with a single card with two proposal', async function (assert) {
    // given
    const qabElement = {
      id: 'ed795d29-5f04-499c-a9c8-4019125c5cb1',
      type: 'qab',
      instruction:
        '<p><strong>Maintenant, entraînez-vous sur des exemples concrets !</strong> </p> <p> Pour chaque exemple, choisissez si l’affirmation est <strong>vraie</strong> ou <strong>fausse</strong>.</p>',
      cards: [
        {
          id: 'e222b060-7c18-4ee2-afe2-2ae27c28946a',
          image: {
            url: 'https://assets.pix.org/modules/bac-a-sable/boules-de-petanque.jpg',
            altText: '',
          },
          text: 'Les boules de pétanques sont creuses.',
          proposalA: 'Vrai',
          proposalB: 'Faux',
          solution: 'A',
        },
      ],
    };

    // when
    const screen = await render(<template><ModuleQabElement @element={{qabElement}} /></template>);

    // then
    assert.ok(screen.getByText('Maintenant, entraînez-vous sur des exemples concrets !'));
    assert.ok(screen.getByText('Les boules de pétanques sont creuses.'));
    assert.ok(screen.getByRole('button', { name: 'Option A: Vrai' }));
    assert.ok(screen.getByRole('button', { name: 'Option B: Faux' }));
  });
});
