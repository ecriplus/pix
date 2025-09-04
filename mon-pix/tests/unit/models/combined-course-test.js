import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | Combined Course', function (hooks) {
  setupTest(hooks);

  let store;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
  });
  module('#nextCombinedCourseItemLink', function () {
    test('when user has not completed any item', function (assert) {
      const combinedCourseItem = store.createRecord('combined-course-item', {
        isCompleted: false,
        redirection: '/campagnes/CODE123',
      });
      const combinedCourse = store.createRecord('combined-course');
      combinedCourse.items = [combinedCourseItem];
      assert.strictEqual(combinedCourse.nextCombinedCourseItem, combinedCourseItem);
    });
    test('when all items are completed', function (assert) {
      const combinedCourseItem = store.createRecord('combined-course-item', {
        isCompleted: true,
        redirection: '/campagnes/CODE123',
      });
      const combinedCourse = store.createRecord('combined-course');
      combinedCourse.items = [combinedCourseItem];
      assert.strictEqual(combinedCourse.nextCombinedCourseItem, undefined);
    });
    test('when one item is completed and the other is not', function (assert) {
      const combinedCourseItem = store.createRecord('combined-course-item', {
        isCompleted: true,
        redirection: '/modules/demo-combinix-1',
      });
      const secondCombinedCourseItem = store.createRecord('combined-course-item', {
        isCompleted: false,
        redirection: '/campagnes/CODE123',
      });
      const combinedCourse = store.createRecord('combined-course');
      combinedCourse.items = [combinedCourseItem, secondCombinedCourseItem];
      assert.strictEqual(combinedCourse.nextCombinedCourseItem, secondCombinedCourseItem);
    });
  });
});
