import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import TagLevel from 'pix-orga/components/statistics/tag-level';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Statistics | TagLevel', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('#get category', function () {
    test('when level is lower than 3 it should return novice', async function (assert) {
      //given
      const level = 2;

      //when
      const screen = await render(<template><TagLevel @level={{level}} /></template>);

      //then
      assert.ok(screen.getByText(t('pages.statistics.level.novice')));
    });
    test('when level is lower than 5 it should return independent', async function (assert) {
      //given
      const level = 4;

      //when
      const screen = await render(<template><TagLevel @level={{level}} /></template>);

      //then
      assert.ok(screen.getByText(t('pages.statistics.level.independent')));
    });
    test('when level is lower than 7 it should return advanced', async function (assert) {
      //given
      const level = 6;

      //when
      const screen = await render(<template><TagLevel @level={{level}} /></template>);

      //then
      assert.ok(screen.getByText(t('pages.statistics.level.advanced')));
    });
    test('when level is upper or equal 7 it should return expert', async function (assert) {
      //given
      const level = 7;

      //when
      const screen = await render(<template><TagLevel @level={{level}} /></template>);

      //then
      assert.ok(screen.getByText(t('pages.statistics.level.expert')));
    });
  });
});
