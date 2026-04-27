import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import List from 'pix-orga/components/catalogue/list';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Catalogue::List', function (hooks) {
  setupIntlRenderingTest(hooks);

  hooks.beforeEach(function () {
    const router = this.owner.lookup('service:router');
    router.transitionTo = () => {};
  });

  module('when there are no items', function () {
    test('it displays an empty state', async function (assert) {
      const courses = [];
      const screen = await render(<template><List @courses={{courses}} /></template>);

      assert.dom(screen.getByText(t('pages.catalogue.empty-state'))).exists();
    });
  });

  module('when there are course items', function () {
    test('it shows all items', async function (assert) {
      const courses = [
        { name: 'Ma super formation', type: 'targetProfile', nbTubes: 5, category: 'PREDEFINED' },
        { name: 'Mon parcours combiné', type: 'blueprint', nbModules: 2 },
      ];

      const screen = await render(<template><List @courses={{courses}} @type="all" /></template>);

      assert.dom(screen.getByRole('heading', { level: 3, name: 'Ma super formation' })).exists();
      assert.dom(screen.getByRole('heading', { level: 3, name: 'Mon parcours combiné' })).exists();
    });
    module('type filters', function () {
      test('it displays navigation links to filter by type', async function (assert) {
        const courses = [
          { name: 'Ma super formation', type: 'targetProfile', nbTubes: 5, category: 'PREDEFINED' },
          { name: 'Mon parcours combiné', type: 'blueprint', nbModules: 2 },
        ];

        const screen = await render(<template><List @courses={{courses}} @type="blueprint" /></template>);
        const allLink = screen.getByRole('link', { name: t('pages.catalogue.tab-filters.all') });
        assert.ok(allLink.href.endsWith('/catalogue/all'));
        const targetProfilLink = screen.getByRole('link', { name: t('pages.catalogue.tab-filters.target-profiles') });
        assert.ok(targetProfilLink.href.endsWith('/catalogue/targetProfile'));
        const blueprintLink = screen.getByRole('link', { name: t('pages.catalogue.tab-filters.blueprints') });
        assert.ok(blueprintLink.href.endsWith('/catalogue/blueprint'));
      });
      test('it filters list by type', async function (assert) {
        const courses = [
          { name: 'Ma super formation', type: 'targetProfile', nbTubes: 5, category: 'PREDEFINED' },
          { name: 'Mon parcours combiné', type: 'blueprint', nbModules: 2 },
        ];

        const screen = await render(<template><List @courses={{courses}} @type="blueprint" /></template>);

        const items = screen.getAllByRole('heading', { level: 3 });
        assert.strictEqual(items.length, 1);
      });
    });
  });
});
