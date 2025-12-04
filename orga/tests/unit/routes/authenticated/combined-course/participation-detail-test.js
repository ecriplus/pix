import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/combined-course', function (hooks) {
  setupTest(hooks);

  hooks.afterEach(function () {
    sinon.restore();
  });

  module('beforeModel', function () {
    test('user is redirected to index when he has no access', async function (assert) {
      // given
      const route = this.owner.lookup('route:authenticated/combined-course/participation-detail');
      const router = this.owner.lookup('service:router');
      const currentUser = this.owner.lookup('service:current-user');

      const replaceWithStub = sinon.stub(router, 'replaceWith');
      sinon.stub(currentUser, 'canAccessCampaignsPage').value(false);

      // when
      await route.beforeModel();

      // then
      assert.ok(replaceWithStub.calledWithExactly('authenticated.index'));
    });
  });

  module('model', function () {
    test('fetch a combined course participation detail', async function (assert) {
      // given
      const route = this.owner.lookup('route:authenticated/combined-course/participation-detail');
      const store = this.owner.lookup('service:store');

      const combinedCourseId = Symbol('combinedCourseId');
      const combinedCourse = { id: combinedCourseId };
      sinon.stub(route, 'modelFor').returns(combinedCourse);

      const participationId = Symbol('participationId');
      const participationDetail = { participation: Symbol('participation'), items: Symbol('items') };

      sinon
        .stub(store, 'queryRecord')
        .withArgs('combined-course-participation-detail', { combinedCourseId, participationId })
        .resolves(participationDetail);

      // when
      const result = await route.model({ participation_id: participationId });

      // then
      assert.deepEqual(result, {
        combinedCourse,
        participation: participationDetail.participation,
        items: participationDetail.items,
      });
    });

    test('replace route with not-found route when queryRecord throws', async function (assert) {
      // given
      const route = this.owner.lookup('route:authenticated/combined-course/participation-detail');
      const router = this.owner.lookup('service:router');
      const store = this.owner.lookup('service:store');

      const combinedCourseId = Symbol('combinedCourseId');
      const combinedCourse = { id: combinedCourseId };
      sinon.stub(route, 'modelFor').returns(combinedCourse);

      const replaceWithStub = sinon.stub(router, 'replaceWith');
      sinon.stub(store, 'queryRecord').rejects(new Error('olala'));
      sinon.stub(console, 'error');

      // when
      await route.model({});

      // then
      assert.ok(replaceWithStub.calledWithExactly('not-found'));
    });
  });
});
