import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | user', function (hooks) {
  setupTest(hooks);

  let store;

  hooks.beforeEach(async function () {
    store = this.owner.lookup('service:store');
  });

  module('#fullName', function () {
    test('it should return the fullname, combination of last and first name', function (assert) {
      // given
      const user = store.createRecord('user', { firstName: 'Jean-Baptiste', lastName: 'Poquelin' });

      // when
      const fullName = user.fullName;

      // then
      assert.strictEqual(fullName, 'Jean-Baptiste Poquelin');
    });
  });

  module('#certificationCoursesCount', function () {
    test('it should return the number of certification courses', function (assert) {
      // given
      const certificationCourse1 = store.createRecord('user-certification-course');
      const certificationCourse2 = store.createRecord('user-certification-course');
      const user = store.createRecord('user', {
        certificationCourses: [certificationCourse1, certificationCourse2],
      });

      // when
      const count = user.certificationCoursesCount;

      // then
      assert.strictEqual(count, 2);
    });

    test('it should return 0 when user has no certification courses', function (assert) {
      // given
      const user = store.createRecord('user', { certificationCourses: [] });

      // when
      const count = user.certificationCoursesCount;

      // then
      assert.strictEqual(count, 0);
    });
  });
});
