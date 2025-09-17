import { setupTest } from 'ember-qunit';
import { CombinedCourseItemTypes } from 'mon-pix/models/combined-course-item';
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
        type: CombinedCourseItemTypes.CAMPAIGN,
      });
      assert.strictEqual(combinedCourseItem.route, 'campaigns');
    });

    test('return iconUrl related for campaign', function (assert) {
      const combinedCourseItem = store.createRecord('combined-course-item', {
        type: CombinedCourseItemTypes.CAMPAIGN,
      });
      assert.strictEqual(combinedCourseItem.iconUrl, 'https://assets.pix.org/combined-courses/campaign-icon.svg');
    });
  });

  module('Type is MODULE', function () {
    test('return route campaign', function (assert) {
      const combinedCourseItem = store.createRecord('combined-course-item', {
        type: CombinedCourseItemTypes.MODULE,
      });
      assert.strictEqual(combinedCourseItem.route, 'module');
    });

    test('return iconUrl related for campaign', function (assert) {
      const combinedCourseItem = store.createRecord('combined-course-item', {
        type: CombinedCourseItemTypes.MODULE,
        image: 'my-module-url',
      });
      assert.strictEqual(combinedCourseItem.iconUrl, 'my-module-url');
    });
  });

  module('Type is FORMATION', function () {
    test('return iconUrl related for campaign', function (assert) {
      const combinedCourseItem = store.createRecord('combined-course-item', {
        type: CombinedCourseItemTypes.FORMATION,
        image: 'my-module-url',
      });
      assert.strictEqual(
        combinedCourseItem.iconUrl,
        'https://assets.pix.org/combined-courses/picto_formation_vector.svg',
      );
    });
  });
});
