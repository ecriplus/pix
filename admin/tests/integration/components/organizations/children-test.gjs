import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { t } from 'ember-intl/test-support';
import Children from 'pix-admin/components/organizations/children';
import setupIntlRenderingTest from 'pix-admin/tests/helpers/setup-intl-rendering';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Integration | Component | organizations/children', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when the admin member has access to organization scope', function (hooks) {
    hooks.beforeEach(function () {
      class AccessControlStub extends Service {
        hasAccessToOrganizationActionsScope = true;
      }
      this.owner.register('service:access-control', AccessControlStub);
    });

    test('it should display children list and actions section', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const organization = store.createRecord('organization', { id: '1', name: 'Parent' });
      const child1 = store.createRecord('organization', { id: '2', name: 'Child 1' });
      const child2 = store.createRecord('organization', { id: '3', name: 'Child 2' });
      const children = [child1, child2];

      const onAttachChildSubmitFormStub = sinon.stub();

      // when
      const screen = await render(
        <template>
          <Children
            @organization={{organization}}
            @children={{children}}
            @onAttachChildSubmitForm={{onAttachChildSubmitFormStub}}
          />
        </template>,
      );

      // then
      assert.dom(screen.getByText('Child 1')).exists();
      assert.dom(screen.getByText('Child 2')).exists();
      assert.ok(
        screen.getByRole('link', { name: t('components.organizations.children.create-child-organization-button') }),
      );
    });

    test('it should display an empty message when no children', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const organization = store.createRecord('organization', { id: '1', name: 'Parent' });
      const children = [];
      const onAttachChildSubmitFormStub = sinon.stub();

      // when
      const screen = await render(
        <template>
          <Children
            @organization={{organization}}
            @children={{children}}
            @onAttachChildSubmitForm={{onAttachChildSubmitFormStub}}
          />
        </template>,
      );

      // then
      assert.dom(screen.getByText(t('pages.organization-children.empty-table'))).exists();
    });
  });

  module('when the admin member does not have access to organization scope', function (hooks) {
    hooks.beforeEach(function () {
      class AccessControlStub extends Service {
        hasAccessToOrganizationActionsScope = false;
      }
      this.owner.register('service:access-control', AccessControlStub);
    });

    test('it should not render the actions section', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const organization = store.createRecord('organization', { id: '1', name: 'Parent' });
      const children = [];
      const onAttachChildSubmitFormStub = sinon.stub();

      // when
      const screen = await render(
        <template>
          <Children
            @organization={{organization}}
            @children={{children}}
            @onAttachChildSubmitForm={{onAttachChildSubmitFormStub}}
          />
        </template>,
      );

      // then
      assert.notOk(
        screen.queryByRole('link', { name: t('components.organizations.children.create-child-organization-button') }),
      );
    });
  });
});
