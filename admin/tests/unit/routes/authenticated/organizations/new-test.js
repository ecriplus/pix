import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/organizations/new', function (hooks) {
  setupTest(hooks);
  const transition = { to: { queryParams: {} } };

  test('it should check if current user is super admin, support, or metier', function (assert) {
    // given
    const route = this.owner.lookup('route:authenticated/organizations/new');

    const restrictAccessToStub = sinon.stub().returns();
    class AccessControlStub extends Service {
      restrictAccessTo = restrictAccessToStub;
    }
    this.owner.register('service:access-control', AccessControlStub);

    // when
    route.beforeModel(transition);

    // then
    assert.ok(restrictAccessToStub.calledWith(['isSuperAdmin', 'isSupport', 'isMetier'], 'authenticated'));
  });

  test('it should allow super admin to access page', function (assert) {
    // given
    const route = this.owner.lookup('route:authenticated/organizations/new');
    const router = this.owner.lookup('service:router');
    router.transitionTo = sinon.stub();

    class CurrentUserStub extends Service {
      adminMember = { isSuperAdmin: true };
    }

    this.owner.register('service:current-user', CurrentUserStub);

    // when
    route.beforeModel(transition);

    // then
    assert.ok(router.transitionTo.notCalled);
  });

  test('it should allow support to access page', function (assert) {
    // given
    const route = this.owner.lookup('route:authenticated/organizations/new');
    const router = this.owner.lookup('service:router');
    router.transitionTo = sinon.stub();

    class CurrentUserStub extends Service {
      adminMember = { isSupport: true };
    }

    this.owner.register('service:current-user', CurrentUserStub);

    // when
    route.beforeModel(transition);

    // then
    assert.ok(router.transitionTo.notCalled);
  });

  test('it should allow metier to access page', function (assert) {
    // given
    const route = this.owner.lookup('route:authenticated/organizations/new');
    const router = this.owner.lookup('service:router');
    router.transitionTo = sinon.stub();

    class CurrentUserStub extends Service {
      adminMember = { isMetier: true };
    }

    this.owner.register('service:current-user', CurrentUserStub);

    // when
    route.beforeModel(transition);

    // then
    assert.ok(router.transitionTo.notCalled);
  });

  test('it should redirect certif to home page', function (assert) {
    // given
    const route = this.owner.lookup('route:authenticated/organizations/new');
    const router = this.owner.lookup('service:router');
    router.transitionTo = sinon.stub();

    class CurrentUserStub extends Service {
      adminMember = { isCertif: true };
    }

    this.owner.register('service:current-user', CurrentUserStub);

    // when
    route.beforeModel(transition);

    // then
    assert.ok(router.transitionTo.called);
  });

  module('query params', function (hooks) {
    let route;
    let router;
    hooks.beforeEach(function () {
      route = this.owner.lookup('route:authenticated/organizations/new');
      router = this.owner.lookup('service:router');
      sinon.stub(router, 'replaceWith');
      class AccessControlStub extends Service {
        restrictAccessTo = sinon.stub();
      }
      this.owner.register('service:access-control', AccessControlStub);
    });
    test('it should allow parentOrganizationId and parentOrganizationName query params', async function (assert) {
      // given
      const transition = {
        to: {
          queryParams: {
            parentOrganizationId: '1',
            parentOrganizationName: 'Orga Name',
          },
        },
      };

      // when
      route.beforeModel(transition);

      // then
      assert.ok(router.replaceWith.notCalled);
    });

    test('it should allow any other query params', async function (assert) {
      // given
      const transition = {
        to: {
          queryParams: {
            otherQueryParam: 'A random query param',
          },
        },
      };

      // when
      route.beforeModel(transition);

      // then
      assert.ok(router.replaceWith.notCalled);
    });

    test('it should redirect to home page and set query params to null if one of parentOrganizationId and parentOrganizationName is provided but the other is missing', async function (assert) {
      // given
      const routeToRedirect = 'authenticated';

      const transition = {
        to: {
          queryParams: {
            parentOrganizationId: '1',
          },
        },
      };

      // when
      route.beforeModel(transition);

      // then
      assert.ok(
        router.replaceWith.calledWith(routeToRedirect, {
          queryParams: {
            parentOrganizationId: null,
            parentOrganizationName: null,
          },
        }),
      );
    });

    module('when parentOrganizationId is provided', function () {
      test('it should fetch the parent organization', async function (assert) {
        // given
        const transition = {
          to: {
            queryParams: {
              parentOrganizationId: '1',
            },
          },
        };
        const store = route.store;
        sinon.stub(store, 'findAll').resolves([]);
        const findRecordStub = sinon.stub(store, 'findRecord').resolves({ id: '1', name: 'Parent Org' });

        // when
        const model = await route.model(undefined, transition);

        // then
        assert.ok(findRecordStub.calledWith('organization', '1'));
        assert.deepEqual(model.parentOrganization, { id: '1', name: 'Parent Org' });
      });
    });
  });
});
