import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | Combined Course Item', function (hooks) {
  setupTest(hooks);

  let store;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
  });

  module('Type is CAMPAIGN', function () {
    test('return route campaign', function (assert) {
      const combinedCourseItem = store.createRecord('combined-course-item', {
        type: 'CAMPAIGN',
      });
      assert.strictEqual(combinedCourseItem.route, 'campaigns');
    });

    test('return iconUrl related for campaign', function (assert) {
      const combinedCourseItem = store.createRecord('combined-course-item', {
        type: 'CAMPAIGN',
      });
      assert.strictEqual(combinedCourseItem.iconUrl, '/images/combined-course/campaign-icon.svg');
    });
  });

  module('Type is module', function () {
    test('return route campaign', function (assert) {
      const combinedCourseItem = store.createRecord('combined-course-item', {
        type: 'MODULE',
      });
      assert.strictEqual(combinedCourseItem.route, 'module');
    });

    test('return iconUrl related for campaign', function (assert) {
      const combinedCourseItem = store.createRecord('combined-course-item', {
        type: 'MODULE',
        image: 'my-module-url',
      });
      assert.strictEqual(combinedCourseItem.iconUrl, 'my-module-url');
    });
  });
});
