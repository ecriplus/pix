import { setupTest } from 'ember-qunit';
import { assessmentResultStatus } from 'pix-admin/models/certification';
import { module, test } from 'qunit';

import createGlimmerComponent from '../../../../../helpers/create-glimmer-component';

module('Unit | Component | certifications/certification/informations/global-actions', function (hooks) {
  setupTest(hooks);

  let component;

  hooks.beforeEach(function () {
    component = createGlimmerComponent('component:certifications/certification/informations/global-actions');
  });

  module('#displayCancelCertificationButton', function () {
    module('when the certification is not cancelled, not published and the session is finalized', function () {
      test('should return true', function (assert) {
        // given
        component.args = {
          certification: { isCertificationCancelled: false, isPublished: false },
          session: { finalizedAt: new Date() },
        };

        // then
        assert.true(component.displayCancelCertificationButton);
      });
    });

    module('when the certification is cancelled', function () {
      test('should return false', function (assert) {
        // given
        component.args = {
          certification: { isCertificationCancelled: true, isPublished: false },
          session: { finalizedAt: new Date() },
        };

        // then
        assert.false(component.displayCancelCertificationButton);
      });
    });

    module('when the certification is published', function () {
      test('should return false', function (assert) {
        // given
        component.args = {
          certification: { isCertificationCancelled: false, isPublished: true },
          session: { finalizedAt: new Date() },
        };

        // then
        assert.false(component.displayCancelCertificationButton);
      });
    });

    module('when the session is not finalized', function () {
      test('should return false', function (assert) {
        // given
        component.args = {
          certification: { isCertificationCancelled: false, isPublished: false },
          session: { finalizedAt: null },
        };

        // then
        assert.false(component.displayCancelCertificationButton);
      });
    });
  });

  module('#displayUncancelCertificationButton', function () {
    module('when the certification is cancelled, not published and the session is finalized', function () {
      test('should return true', function (assert) {
        // given
        component.args = {
          certification: { isCertificationCancelled: true, isPublished: false },
          session: { finalizedAt: new Date() },
        };

        // then
        assert.true(component.displayUncancelCertificationButton);
      });
    });

    module('when the certification is not cancelled', function () {
      test('should return false', function (assert) {
        // given
        component.args = {
          certification: { isCertificationCancelled: false, isPublished: true },
          session: { finalizedAt: new Date() },
        };

        // then
        assert.false(component.displayCancelCertificationButton);
      });
    });
    module('when the certification is published', function () {
      test('should return false', function (assert) {
        // given
        component.args = {
          certification: { isCertificationCancelled: true, isPublished: true },
          session: { finalizedAt: new Date() },
        };

        // then
        assert.false(component.displayCancelCertificationButton);
      });
    });

    module('when the session is not finalized', function () {
      test('should return false', function (assert) {
        // given
        component.args = {
          certification: { isCertificationCancelled: true, isPublished: false },
          session: { finalizedAt: null },
        };

        // then
        assert.false(component.displayUncancelCertificationButton);
      });
    });
  });

  module('#displayRejectCertificationButton', function () {
    test('when the certification is not rejected, should return true', function (assert) {
      // given
      component.args = {
        certification: { status: 'dummy' },
      };

      // then
      assert.true(component.displayRejectCertificationButton);
    });

    test('when the certification is rejected, should return false', function (assert) {
      // given
      component.args = {
        certification: { status: assessmentResultStatus.REJECTED },
      };

      // then
      assert.false(component.displayRejectCertificationButton);
    });
  });

  module('#displayUnrejectCertificationButton', function () {
    module('when the certification is rejected', function () {
      test('and when the certification is rejected for fraud, should return true', function (assert) {
        // given
        component.args = {
          certification: { status: assessmentResultStatus.REJECTED, isRejectedForFraud: true },
        };

        // then
        assert.true(component.displayUnrejectCertificationButton);
      });

      test('and when the certification is not rejected for fraud, should return false', function (assert) {
        // given
        component.args = {
          certification: { status: assessmentResultStatus.REJECTED, isRejectedForFraud: false },
        };

        // then
        assert.false(component.displayUnrejectCertificationButton);
      });
    });

    test('when the certification is not rejected, should return false', function (assert) {
      // given
      component.args = {
        certification: { status: 'dummy' },
      };

      // then
      assert.false(component.displayUnrejectCertificationButton);
    });
  });
});
