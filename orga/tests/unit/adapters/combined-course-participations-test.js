import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Adapters | combined-course-participations', function (hooks) {
  setupTest(hooks);

  let adapter;

  hooks.beforeEach(function () {
    adapter = this.owner.lookup('adapter:combined-course-participation');
    adapter.ajax = sinon.stub().resolves();
  });

  module('#urlForQuery', () => {
    test('should build query url', async function (assert) {
      const combinedCourseId = 123;
      const query = { combinedCourseId, page: { number: 1, size: 10 } };
      const url = await adapter.urlForQuery(query);

      assert.ok(url.endsWith(`api/combined-courses/${combinedCourseId}/participations`));
      assert.strictEqual(query.combinedCourseId, undefined);
    });
  });
});
