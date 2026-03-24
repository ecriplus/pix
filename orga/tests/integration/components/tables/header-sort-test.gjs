import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import HeaderSort from 'pix-orga/components/table/header-sort';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Tables | header-sort', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display header title', async function (assert) {
    // when
    const screen = await render(
      <template>
        <HeaderSort>Header</HeaderSort>
      </template>,
    );

    // then
    assert.ok(screen.getByText('Header'));
  });

  module('When header sort is enabled', function () {
    test('should display sort-icon', async function (assert) {
      // given
      const defaultLabel = 'mon-label';
      // when
      const screen = await render(
        <template>
          <HeaderSort @isDisabled={{false}} @ariaLabelDefaultSort={{defaultLabel}}>Header</HeaderSort>
        </template>,
      );

      // then
      assert.ok(screen.getByLabelText('mon-label'));
    });

    test('it call onSort with "asc" when no order is given', async function (assert) {
      //given
      const onSortStub = sinon.stub();

      // when
      const screen = await render(
        <template>
          <HeaderSort
            @isDisabled={{false}}
            @order={{null}}
            @onSort={{onSortStub}}
            @ariaLabelDefaultSort="Trier par pertinence"
            @ariaLabelSortUp="Trié par ordre croissant"
            @ariaLabelSortDown="Trié par ordre décroissant"
          >Header</HeaderSort>
        </template>,
      );

      await click(screen.getByLabelText('Trier par pertinence'));

      // then
      assert.ok(onSortStub.calledWith('asc'));
    });

    test('it call onSort with "asc" when order is "desc"', async function (assert) {
      //given
      const onSortStub = sinon.stub();

      // when
      const screen = await render(
        <template>
          <HeaderSort
            @isDisabled={{false}}
            @order="desc"
            @onSort={{onSortStub}}
            @ariaLabelDefaultSort="Trier par pertinence"
            @ariaLabelSortUp="Trié par ordre croissant"
            @ariaLabelSortDown="Trié par ordre décroissant"
          >Header</HeaderSort>
        </template>,
      );

      await click(screen.getByLabelText('Trié par ordre décroissant'));

      // then
      assert.ok(onSortStub.calledWith('asc'));
    });

    test('it call onSort with "desc" when order is "asc"', async function (assert) {
      //given
      const onSortStub = sinon.stub();

      // when
      const screen = await render(
        <template>
          <HeaderSort
            @isDisabled={{false}}
            @onSort={{onSortStub}}
            @order="asc"
            @ariaLabelDefaultSort="Trier par pertinence"
            @ariaLabelSortUp="Trié par ordre croissant"
            @ariaLabelSortDown="Trié par ordre décroissant"
          >Header</HeaderSort>
        </template>,
      );

      await click(screen.getByLabelText('Trié par ordre croissant'));

      // then
      assert.ok(onSortStub.calledWith('desc'));
    });
  });

  module('When header sort is disabled', function () {
    test('should not display arrow', async function (assert) {
      // when
      const screen = await render(
        <template>
          <HeaderSort @isDisabled={{true}} @ariaLabel="Trier par pertinence">Header</HeaderSort>
        </template>,
      );

      // then
      assert.notOk(screen.queryByLabelText('Trier par pertinence'));
    });
  });
});
