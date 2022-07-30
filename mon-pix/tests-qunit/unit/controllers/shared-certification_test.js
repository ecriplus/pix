import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | shared-certification', function (hooks) {
  setupTest(hooks);

  module('#get shouldDisplayDetailsSection', function () {
    test('should return true when certification has a commentForCandidate', function (assert) {
      const controller = this.owner.lookup('controller:shared-certification');
      const store = this.owner.lookup('service:store');
      controller.model = store.createRecord('certification', {
        firstName: 'Laura',
        lastName: 'Summers',
        commentForCandidate: 'some comment',
        cleaCertificationStatus: 'not_taken',
        certifiedBadgeImages: [],
      });

      // when
      const shouldDisplayDetailsSection = controller.shouldDisplayDetailsSection;

      // then
      assert.true(shouldDisplayDetailsSection);
    });

    test('should return true when certification has an acquired clea certification', function (assert) {
      const controller = this.owner.lookup('controller:shared-certification');
      const store = this.owner.lookup('service:store');
      controller.model = store.createRecord('certification', {
        firstName: 'Laura',
        lastName: 'Summers',
        commentForCandidate: null,
        cleaCertificationStatus: 'acquired',
        certifiedBadgeImages: [],
      });

      // when
      const shouldDisplayDetailsSection = controller.shouldDisplayDetailsSection;

      // then
      assert.true(shouldDisplayDetailsSection);
    });

    test('should return true when certification has at least one certified badge image', function (assert) {
      const controller = this.owner.lookup('controller:shared-certification');
      const store = this.owner.lookup('service:store');
      controller.model = store.createRecord('certification', {
        firstName: 'Laura',
        lastName: 'Summers',
        commentForCandidate: null,
        cleaCertificationStatus: 'not_taken',
        certifiedBadgeImages: ['/some/img'],
      });

      // when
      const shouldDisplayDetailsSection = controller.shouldDisplayDetailsSection;

      // then
      assert.true(shouldDisplayDetailsSection);
    });

    test('should return false when none of the above is checked', function (assert) {
      const controller = this.owner.lookup('controller:shared-certification');
      const store = this.owner.lookup('service:store');
      controller.model = store.createRecord('certification', {
        firstName: 'Laura',
        lastName: 'Summers',
        commentForCandidate: null,
        cleaCertificationStatus: 'not_taken',
        certifiedBadgeImages: [],
      });

      // when
      const shouldDisplayDetailsSection = controller.shouldDisplayDetailsSection;

      // then
      assert.false(shouldDisplayDetailsSection);
    });
  });
});
