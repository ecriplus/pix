import { render } from '@1024pix/ember-testing-library';
import Chevron from 'pix-orga/components/ui/chevron';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Ui::Chevron', function (hooks) {
  setupIntlRenderingTest(hooks);
  test('it renders', async function (assert) {
    // given
    const isOpen = false;
    const onClick = sinon.stub();
    const label = 'mon-label';

    // when
    const screen = await render(
      <template><Chevron @isOpen={{isOpen}} @onClick={{onClick}} @ariaLabel={{label}} /></template>,
    );

    // then
    assert.dom('button[type=button]').exists();
    assert.dom('[aria-expanded="false"]').exists();
    assert.ok(screen.getByLabelText('mon-label'));
  });

  test('it should open the accordion when it is closed', async function (assert) {
    // given
    const onClick = sinon.stub();

    // when
    await render(<template><Chevron @isOpen={{true}} @onClick={{onClick}} /></template>);

    // then
    assert.dom('[aria-expanded="true"]').exists();
  });

  test('it should close the accordion when it already open', async function (assert) {
    // given
    const onClick = sinon.stub();

    // when
    await render(<template><Chevron @isOpen={{false}} @onClick={{onClick}} /></template>);

    // then
    assert.dom('[aria-expanded="false"]').exists();
  });
});
