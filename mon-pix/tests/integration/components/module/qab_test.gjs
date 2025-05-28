import { render } from '@1024pix/ember-testing-library';
import { click, find } from '@ember/test-helpers';
import ModuleQabElement, { NEXT_CARD_DELAY } from 'mon-pix/components/module/element/qab/qab';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | QAB', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display a QAB with a single card with two proposal', async function (assert) {
    // given
    const qabElement = _getQabElement();

    // when
    const screen = await render(<template><ModuleQabElement @element={{qabElement}} /></template>);

    // then
    assert.ok(screen.getByText('Maintenant, entraînez-vous sur des exemples concrets !'));
    assert.ok(screen.getByText('Les boules de pétanques sont creuses.'));
    assert.ok(screen.getByRole('button', { name: 'Option A: Vrai' }));
    assert.ok(screen.getByRole('button', { name: 'Option B: Faux' }));
  });

  module('when proposal A is the solution', function () {
    test('should display the correct proposal as success', async function (assert) {
      // given
      const solution = 'A';
      const qabElement = _getQabElement(solution);

      // when
      const screen = await render(<template><ModuleQabElement @element={{qabElement}} /></template>);

      // then
      assert.dom(screen.getByRole('button', { name: 'Option A: Vrai' })).hasClass('qab-proposal-button--success');
      assert.dom(screen.getByRole('button', { name: 'Option B: Faux' })).hasClass('qab-proposal-button--error');
    });
  });

  module('when proposal B is the solution', function () {
    test('should display the correct proposal as success', async function (assert) {
      // given
      const solution = 'B';
      const qabElement = _getQabElement(solution);

      // when
      const screen = await render(<template><ModuleQabElement @element={{qabElement}} /></template>);

      // then
      assert.dom(screen.getByRole('button', { name: 'Option A: Vrai' })).hasClass('qab-proposal-button--error');
      assert.dom(screen.getByRole('button', { name: 'Option B: Faux' })).hasClass('qab-proposal-button--success');
    });
  });

  module('when users answers the QAB', function () {
    module('when users chooses proposal A', function () {
      test('should display proposal A as selected and card status as success', async function (assert) {
        // given
        const qabElement = _getQabElement();

        // when
        const screen = await render(<template><ModuleQabElement @element={{qabElement}} /></template>);
        await click(screen.getByRole('button', { name: 'Option A: Vrai' }));

        // then
        assert.dom(screen.getByRole('button', { name: 'Option A: Vrai' })).hasClass('qab-proposal-button--selected');
        assert.dom(screen.getByRole('button', { name: 'Option A: Vrai' })).isDisabled();
        assert
          .dom(screen.getByRole('button', { name: 'Option B: Faux' }))
          .doesNotHaveClass('qab-proposal-button--selected');
        assert.dom(screen.getByRole('button', { name: 'Option B: Faux' })).isDisabled();
        assert.dom(screen.getByRole('status')).hasText('Bonne réponse !');
      });
    });

    module('when user chooses proposal B', function () {
      test('should display proposal B as selected and card status as error', async function (assert) {
        // given
        const qabElement = _getQabElement();

        // when
        const screen = await render(<template><ModuleQabElement @element={{qabElement}} /></template>);
        await click(screen.getByRole('button', { name: 'Option B: Faux' }));

        // then
        assert
          .dom(screen.getByRole('button', { name: 'Option A: Vrai' }))
          .doesNotHaveClass('qab-proposal-button--selected');
        assert.dom(screen.getByRole('button', { name: 'Option A: Vrai' })).isDisabled();
        assert.dom(screen.getByRole('button', { name: 'Option B: Faux' })).hasClass('qab-proposal-button--selected');
        assert.dom(screen.getByRole('button', { name: 'Option B: Faux' })).isDisabled();
        assert.dom(screen.getByRole('status')).hasText('Mauvaise réponse.');
      });
    });
  });
});

function _getQabElement(solution = 'A') {
  return {
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
        solution,
      },
    ],
  };
}
