import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/catalogue/list', function (hooks) {
  setupTest(hooks);

  hooks.afterEach(function () {
    sinon.restore();
  });

  module('beforeModel', function () {
    ['all', 'targetProfile', 'blueprint'].forEach((type) => {
      test(`it should not redirect if param type=${type}`, async function (assert) {
        // given
        const routerService = this.owner.lookup('service:router');
        sinon.stub(routerService, 'replaceWith');
        const route = this.owner.lookup('route:authenticated/catalogue/list');

        // when
        await route.beforeModel({ to: { params: { type } } });

        //then
        assert.ok(routerService.replaceWith.notCalled);
      });
    });

    test('it should redirect to catalogue list page with type=all if type params is not supported', async function (assert) {
      // given

      const routerService = this.owner.lookup('service:router');
      sinon.stub(routerService, 'replaceWith');
      const route = this.owner.lookup('route:authenticated/catalogue/list');

      // when
      await route.beforeModel({ to: { params: null } });

      //then
      assert.ok(routerService.replaceWith.calledOnceWithExactly('authenticated.catalogue.list', 'all'));
    });
  });

  module('model', function () {
    test('it fetches courses from the API when none are present in the store', async function (assert) {
      // given
      const route = this.owner.lookup('route:authenticated/catalogue/list');
      const store = this.owner.lookup('service:store');
      const currentUser = this.owner.lookup('service:current-user');
      const organizationId = Symbol('organizationId');
      sinon.stub(currentUser, 'organization').value({ id: organizationId });
      const courses = Symbol('Courses');

      sinon.stub(store, 'peekAll').withArgs('course').returns([]);
      sinon.stub(store, 'findAll').withArgs('course', { adapterOptions: { organizationId } }).resolves(courses);

      // when
      const result = await route.model({ type: 'all' });

      // then
      assert.ok(store.findAll.calledOnce);
      assert.deepEqual(result, { courses, type: 'all' });
    });
    test('it returns cached courses without calling the API when the store is not empty', async function (assert) {
      // given
      const route = this.owner.lookup('route:authenticated/catalogue/list');
      const store = this.owner.lookup('service:store');
      const courses = [Symbol('Course')];
      sinon.stub(store, 'peekAll').withArgs('course').returns(courses);
      sinon.stub(store, 'findAll');

      // when
      const result = await route.model({ type: 'all' });
      // then
      assert.ok(store.findAll.notCalled);
      assert.deepEqual(result, { courses, type: 'all' });
    });
  });
});
