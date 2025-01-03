import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import ModulixExpandElement from 'mon-pix/components/module/element/expand';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | Expand', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display the title of an expand', async function (assert) {
    // given
    const content = 'My content';
    const expandElement = {
      title: 'Expand title',
      content: `<p>${content}</p>`,
    };

    //  when
    const screen = await render(<template><ModulixExpandElement @expand={{expandElement}} /></template>);

    // then
    const detailsElement = screen.getByRole('group');
    assert.dom(detailsElement).exists();
    assert.dom(screen.getByText(expandElement.title)).exists();
    assert.dom(screen.getByText(content)).exists();
  });

  module('when user opens Expand element', function () {
    test('should call method onExpandToggle with isOpen set to true', async function (assert) {
      // given
      const content = 'My content';
      const expandElement = {
        id: 'f5e7ce21-b71d-4054-8886-a4e9a17016ff',
        title: 'Expand title',
        content: `<p>${content}</p>`,
      };
      const onExpandToggleStub = sinon.stub();

      //  when
      const screen = await render(
        <template><ModulixExpandElement @expand={{expandElement}} @onExpandToggle={{onExpandToggleStub}} /></template>,
      );
      const detailsElement = screen.getByRole('group');

      const expandSummarySelector = '.modulix-expand__title';
      await click(expandSummarySelector);

      // then
      sinon.assert.calledOnceWithExactly(onExpandToggleStub, { elementId: expandElement.id, isOpen: true });
      assert.dom(detailsElement).hasAttribute('open');
    });
  });

  module('when Expand element is open and user closes it', function () {
    test('should call method onExpandToggle with isOpen set to false', async function (assert) {
      // given
      const content = 'My content';
      const expandElement = {
        id: 'f5e7ce21-b71d-4054-8886-a4e9a17016ff',
        title: 'Expand title',
        content: `<p>${content}</p>`,
      };
      const onExpandToggleStub = sinon.stub();

      //  when
      const screen = await render(
        <template><ModulixExpandElement @expand={{expandElement}} @onExpandToggle={{onExpandToggleStub}} /></template>,
      );
      const detailsElement = screen.getByRole('group');
      detailsElement.open = true;

      const expandSummarySelector = '.modulix-expand__title';
      await click(expandSummarySelector);

      // then
      sinon.assert.calledOnceWithExactly(onExpandToggleStub, { elementId: expandElement.id, isOpen: false });
      assert.dom(detailsElement).doesNotHaveAttribute('open');
    });
  });
});
