import { render } from '@1024pix/ember-testing-library';
import ProposalButton from 'mon-pix/components/module/component/proposal-button';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | ProposalButton', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display a button for given proposal', async function (assert) {
    // given
    const proposal = {
      id: '1',
      content: 'Avant de mettre le dentifrice',
      feedback: {
        diagnosis: "<p>C'est l'approche de la plupart des gens.</p>",
      },
    };

    // when
    const screen = await render(<template><ProposalButton @proposal={{proposal}} /></template>);

    // then
    assert.ok(screen.getByRole('button', { name: proposal.content }));
  });

  module('when proposal is disabled', function () {
    test('should display a disabled button', async function (assert) {
      const proposal = {
        id: '1',
        content: 'Avant de mettre le dentifrice',
        feedback: {
          diagnosis: "<p>C'est l'approche de la plupart des gens.</p>",
        },
      };

      // when
      const screen = await render(<template><ProposalButton @proposal={{proposal}} @isDisabled={{true}} /></template>);

      // then
      assert.dom(screen.getByRole('button', { name: proposal.content })).hasAttribute('aria-disabled');
    });

    test('it should not send a click event when clicking on the proposal button', async function (assert) {
      const proposal = {
        id: '1',
        content: 'Avant de mettre le dentifrice',
        feedback: {
          diagnosis: "<p>C'est l'approche de la plupart des gens.</p>",
        },
      };

      const onSubmit = sinon.stub();

      // when
      await render(
        <template>
          <form onSubmit={{onSubmit}}><ProposalButton @proposal={{proposal}} @isDisabled={{true}} /></form>
        </template>,
      );

      // then
      sinon.assert.notCalled(onSubmit);
      assert.ok(true);
    });
  });

  module('when proposal is selected', function () {
    test('should have a selected class', async function (assert) {
      const proposal = {
        id: '1',
        content: 'Avant de mettre le dentifrice',
        feedback: {
          diagnosis: "<p>C'est l'approche de la plupart des gens.</p>",
        },
      };

      // when
      const screen = await render(<template><ProposalButton @proposal={{proposal}} @isSelected={{true}} /></template>);

      // then
      assert.dom(screen.getByRole('button', { name: proposal.content })).hasClass('proposal-button--selected');
    });
  });
});
