import { render } from '@1024pix/ember-testing-library';
import QabProposalButton from 'mon-pix/components/module/element/qab/proposal-button';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | QabProposalButton', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display a button for given proposal', async function (assert) {
    // given
    const text = 'Vrai';
    const option = 'A';

    // when
    const screen = await render(<template><QabProposalButton @text={{text}} @option={{option}} /></template>);

    // then
    assert.ok(screen.getByRole('button', { name: 'Option A: Vrai' }));
  });

  module('when proposal is disabled', function () {
    test('should display a disabled button', async function (assert) {
      // given
      const text = 'Vrai';
      const option = 'A';

      // when
      const screen = await render(
        <template><QabProposalButton @text={{text}} @option={{option}} @isDisabled={{true}} /></template>,
      );

      // then
      assert.dom(screen.getByRole('button', { name: 'Option A: Vrai' })).hasAttribute('aria-disabled');
    });

    test('it should not send a click event when clicking on the proposal button', async function (assert) {
      const text = 'Faux';
      const option = 'B';

      const onSubmit = sinon.stub();

      // when
      await render(
        <template>
          <form onSubmit={{onSubmit}}><QabProposalButton
              @text={{text}}
              @option={{option}}
              @isDisabled={{true}}
            /></form>
        </template>,
      );

      // then
      sinon.assert.notCalled(onSubmit);
      assert.ok(true);
    });
  });

  module('when proposal is selected', function () {
    test('should have a selected class', async function (assert) {
      // given
      const text = 'Vrai';
      const option = 'A';

      // when
      const screen = await render(
        <template><QabProposalButton @text={{text}} @option={{option}} @isSelected={{true}} /></template>,
      );

      // then
      assert.dom(screen.getByRole('button', { name: 'Option A: Vrai' })).hasClass('qab-proposal-button--selected');
    });
  });

  module('when proposal is correct', function () {
    test('should have a success class', async function (assert) {
      // given
      const text = 'Faux';
      const option = 'B';

      // when
      const screen = await render(
        <template>
          <QabProposalButton @text={{text}} @option={{option}} @isSelected={{true}} @isSolution={{true}} />
        </template>,
      );

      // then
      assert.dom(screen.getByRole('button', { name: 'Option B: Faux' })).hasClass('qab-proposal-button--success');
    });
  });

  module('when proposal is incorrect', function () {
    test('should have an error class', async function (assert) {
      // given
      const text = 'Faux';
      const option = 'B';

      // when
      const screen = await render(
        <template>
          <QabProposalButton @text={{text}} @option={{option}} @isSelected={{true}} @isSolution={{false}} />
        </template>,
      );

      // then
      assert.dom(screen.getByRole('button', { name: 'Option B: Faux' })).hasClass('qab-proposal-button--error');
    });
  });
});
