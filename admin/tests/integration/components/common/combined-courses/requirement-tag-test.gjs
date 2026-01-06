import { render as renderScreen } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import RequirementTag from 'pix-admin/components/common/combined-courses/requirement-tag';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component |  common/combined-courses/requirement-tag', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display a module item when type is not evaluation', async function (assert) {
    const item = {
      type: 'module',
      value: 'abc-123',
    };
    const screen = await renderScreen(
      <template><RequirementTag @type={{item.type}} @value={{item.value}} /></template>,
    );
    assert.ok(screen.getByText(t('components.combined-course-blueprints.items.module'), { exact: false }));
    const link = screen.getByRole('link');
    assert.ok(link.getAttribute('href').endsWith('modules/abc-123/slug/details'));
  });
  test('should display a target profile item when type is evaluation', async function (assert) {
    const item = {
      type: 'evaluation',
      value: 1,
    };
    const screen = await renderScreen(
      <template><RequirementTag @type={{item.type}} @value={{item.value}} /></template>,
    );
    const link = screen.getByRole('link');
    assert.ok(screen.getByText(t('components.combined-course-blueprints.items.targetProfile'), { exact: false }));
    assert.ok(link.getAttribute('href').endsWith(`/target-profiles/${item.value}/details`));
  });

  test('should call onRemove with value and type when remove button is clicked', async function (assert) {
    const item = {
      type: 'module',
      value: 'abc-123',
    };
    const removeStub = sinon.stub();

    const screen = await renderScreen(
      <template><RequirementTag @type={{item.type}} @value={{item.value}} @onRemove={{removeStub}} /></template>,
    );

    await screen.getByRole('button').click();

    assert.ok(removeStub.calledOnceWith(item));
  });

  test('should hide remove button when onRemove is not provided', async function (assert) {
    const item = {
      type: 'module',
      value: 'abc-123',
    };

    const screen = await renderScreen(
      <template><RequirementTag @type={{item.type}} @value={{item.value}} /></template>,
    );

    assert.notOk(screen.queryByRole('button'));
  });
});
