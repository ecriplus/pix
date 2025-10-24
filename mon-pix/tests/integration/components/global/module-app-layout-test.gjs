import { render } from '@1024pix/ember-testing-library';
import ModulixAppLayout from 'mon-pix/components/global/modulix-app-layout';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Global | Module App Layout', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('navigation', function (hooks) {
    let store;
    let featureToggles;
    let routerService;

    hooks.beforeEach(function () {
      store = this.owner.lookup('service:store');
      featureToggles = this.owner.lookup('service:featureToggles');
      routerService = this.owner.lookup('service:router');
    });
    module('When route is ‘passage‘', function () {
      module('When module has multiple sections', function () {
        module('when isModulixNavEnabled feature toggle is enabled', function () {
          test('it should display a navbar', async function (assert) {
            // given
            const currentRoute = {
              name: 'module.passage',
              params: {},
              parent: {
                name: 'module',
                params: {
                  slug: 'mon-slug',
                },
              },
            };
            sinon.stub(routerService, 'currentRoute').value(currentRoute);

            sinon.stub(featureToggles, 'featureToggles').value({ isModulixNavEnabled: true });

            const section = store.createRecord('section', { type: 'question-yourself', grains: [] });
            const anotherSection = store.createRecord('section', { type: 'explore-to-understand', grains: [] });

            store.createRecord('module', {
              slug: 'mon-slug',
              sections: [section, anotherSection],
            });

            // when
            const screen = await render(<template><ModulixAppLayout @isModulixPassage={{true}} /></template>);

            // then
            assert.dom(screen.getByRole('navigation')).exists();
          });
        });

        module('when isModulixNavEnabled feature toggle is disabled', function () {
          test('it should not display a navbar', async function (assert) {
            // given
            const currentRoute = {
              name: 'module.passage',
              params: {},
              parent: {
                name: 'module',
                params: {
                  slug: 'mon-slug',
                },
              },
            };
            sinon.stub(routerService, 'currentRoute').value(currentRoute);

            sinon.stub(featureToggles, 'featureToggles').value({ isModulixNavEnabled: false });

            const section = store.createRecord('section', { type: 'question-yourself', grains: [] });
            const anotherSection = store.createRecord('section', { type: 'explore-to-understand', grains: [] });

            store.createRecord('module', {
              slug: 'mon-slug',
              sections: [section, anotherSection],
            });

            // when
            const screen = await render(<template><ModulixAppLayout @isModulixPassage={{true}} /></template>);

            // then
            assert.dom(screen.queryByRole('navigation')).doesNotExist();
          });
        });
      });

      module('When module has one section', function () {
        test('it should not display a navbar', async function (assert) {
          // given
          const currentRoute = {
            name: 'module.passage',
            params: {},
            parent: {
              name: 'module',
              params: {
                slug: 'mon-slug',
              },
            },
          };
          sinon.stub(routerService, 'currentRoute').value(currentRoute);

          sinon.stub(featureToggles, 'featureToggles').value({ isModulixNavEnabled: true });

          const section = store.createRecord('section', { type: 'blank', grains: [] });

          store.createRecord('module', {
            slug: 'mon-slug',
            sections: [section],
          });

          // when
          const screen = await render(<template><ModulixAppLayout @isModulixPassage={{true}} /></template>);

          // then
          assert.dom(screen.queryByRole('navigation')).doesNotExist();
        });
      });
    });

    module('When route is not ‘passage‘', function () {
      test('should not display modulix navbar', async function (assert) {
        // given
        const currentRoute = {
          name: 'module.details',
          params: {},
          parent: {
            name: 'module',
            params: {
              slug: 'mon-slug',
            },
          },
        };
        sinon.stub(routerService, 'currentRoute').value(currentRoute);

        sinon.stub(featureToggles, 'featureToggles').value({ isModulixNavEnabled: true });

        const section = store.createRecord('section', { type: 'question-yourself', grains: [] });
        const anotherSection = store.createRecord('section', { type: 'explore-to-understand', grains: [] });

        store.createRecord('module', {
          slug: 'mon-slug',
          sections: [section, anotherSection],
        });

        // when
        const screen = await render(<template><ModulixAppLayout @isModulixPassage={{false}} /></template>);

        // then
        assert.dom(screen.queryByRole('navigation')).doesNotExist();
      });
    });
  });
});
