import { render, waitFor } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import List from 'pix-orga/components/catalogue/list';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Catalogue::List', function (hooks) {
  setupIntlRenderingTest(hooks);

  hooks.beforeEach(function () {
    const router = this.owner.lookup('service:router');
    router.transitionTo = () => {};
  });

  module('when there are no items', function () {
    test('it displays an empty state', async function (assert) {
      // given
      const courses = [];
      const updateFilter = sinon.stub();

      // when
      const screen = await render(<template><List @courses={{courses}} @updateFilter={{updateFilter}} /></template>);

      // then
      assert.dom(screen.getByText(t('pages.catalogue.empty-state'))).exists();
    });
  });

  module('when there are course items', function () {
    test('it shows all items', async function (assert) {
      // given
      const courses = [
        { name: 'Ma super formation', type: 'targetProfile', nbTubes: 5, category: 'PREDEFINED' },
        { name: 'Mon parcours combiné', type: 'blueprint', nbModules: 2 },
      ];
      const updateFilter = sinon.stub();

      // when
      const screen = await render(
        <template><List @updateFilter={{updateFilter}} @courses={{courses}} @type="all" /></template>,
      );

      // then
      assert.dom(screen.getByRole('heading', { level: 3, name: 'Ma super formation' })).exists();
      assert.dom(screen.getByRole('heading', { level: 3, name: 'Mon parcours combiné' })).exists();
    });

    module('type filters', function () {
      test('it displays navigation links to filter by type', async function (assert) {
        // given
        const courses = [
          { name: 'Ma super formation', type: 'targetProfile', nbTubes: 5, category: 'PREDEFINED' },
          { name: 'Mon parcours combiné', type: 'blueprint', nbModules: 2 },
        ];
        const updateFilter = sinon.stub();

        // when
        const screen = await render(
          <template><List @courses={{courses}} @updateFilter={{updateFilter}} @type="blueprint" /></template>,
        );

        // then
        const allLink = screen.getByRole('link', { name: t('pages.catalogue.tab-filters.all') });
        assert.ok(allLink.href.endsWith('/catalogue/all'));
        const targetProfilLink = screen.getByRole('link', { name: t('pages.catalogue.tab-filters.target-profiles') });
        assert.ok(targetProfilLink.href.endsWith('/catalogue/targetProfile'));
        const blueprintLink = screen.getByRole('link', { name: t('pages.catalogue.tab-filters.blueprints') });
        assert.ok(blueprintLink.href.endsWith('/catalogue/blueprint'));
      });
      test('it filters list by type', async function (assert) {
        // given
        const courses = [
          { name: 'Ma super formation', type: 'targetProfile', nbTubes: 5, category: 'PREDEFINED' },
          { name: 'Mon parcours combiné', type: 'blueprint', nbModules: 2 },
        ];

        const updateFilter = sinon.stub();

        // when
        const screen = await render(
          <template><List @courses={{courses}} @updateFilter={{updateFilter}} @type="blueprint" /></template>,
        );

        // then
        const items = screen.getAllByRole('heading', { level: 3 });
        assert.strictEqual(items.length, 1);
      });
    });

    module('search filter', function () {
      test('it should filter items list that match search pattern', async function (assert) {
        // given
        const updateFilter = sinon.stub();
        const search = 'super';
        const courses = [
          { name: 'Ma super formation', type: 'targetProfile', nbTubes: 5, category: 'PREDEFINED' },
          { name: 'Mon parcours combiné', type: 'blueprint', nbModules: 2 },
        ];

        // when
        const screen = await render(
          <template>
            <List @search={{search}} @updateFilter={{updateFilter}} @courses={{courses}} @type="all" />
          </template>,
        );

        // then
        assert.strictEqual(screen.getAllByRole('heading', { level: 3 }).length, 1);
        assert.dom(screen.getByRole('heading', { level: 3, name: 'Ma super formation' })).exists();
      });
    });

    module('category filter', function () {
      test('it disabled categories filter if there are no categories to filter', async function (assert) {
        // given
        const updateFilter = sinon.stub();
        const search = 'combiné';
        const courses = [
          { name: 'Ma super formation', type: 'targetProfile', nbTubes: 5, category: 'PREDEFINED' },
          { name: 'Mon parcours combiné', type: 'blueprint', nbModules: 2 },
        ];

        // when
        const screen = await render(
          <template>
            <List @search={{search}} @updateFilter={{updateFilter}} @courses={{courses}} @type="all" />
          </template>,
        );

        // then
        assert
          .dom(screen.getByRole('button', { name: t('pages.catalogue.filters.categories.label'), hidden: true }))
          .exists();
      });

      test('it set categories filter with initial value', async function (assert) {
        // given
        const updateFilter = sinon.stub();
        const categories = ['PREDEFINED'];
        const courses = [
          { name: 'Ma super formation', type: 'targetProfile', nbTubes: 5, category: 'PREDEFINED' },
          { name: 'Mon parcours combiné', type: 'blueprint', nbModules: 2 },
        ];

        // when
        const screen = await render(
          <template>
            <List @categories={{categories}} @updateFilter={{updateFilter}} @courses={{courses}} @type="all" />
          </template>,
        );
        await click(screen.getByRole('button', { name: t('pages.catalogue.filters.categories.label') }));
        await waitFor(() => screen.findByRole('menu'));

        // then
        assert.dom(screen.getByRole('checkbox', { name: t('pages.campaign-creation.tags.PREDEFINED') })).isChecked();
      });

      test('it should filter items list that match selected categories', async function (assert) {
        // given
        const updateFilter = sinon.stub();
        const categories = ['PREDEFINED'];
        const courses = [
          { name: 'Ma super formation', type: 'targetProfile', nbTubes: 5, category: 'PREDEFINED' },
          { name: 'Mon parcours combiné', type: 'blueprint', nbModules: 2 },
        ];

        // when
        const screen = await render(
          <template>
            <List @categories={{categories}} @updateFilter={{updateFilter}} @courses={{courses}} @type="all" />
          </template>,
        );

        // then
        assert.strictEqual(screen.getAllByRole('heading', { level: 3 }).length, 1);
        assert.dom(screen.getByRole('heading', { level: 3, name: 'Ma super formation' })).exists();
      });
    });
  });
});
