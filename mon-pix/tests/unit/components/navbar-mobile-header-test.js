import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import createGlimmerComponent from '../../helpers/create-glimmer-component';
import { stubSessionService } from '../../helpers/service-stubs.js';

module('Unit | Component | Navbar Mobile Header Component', function (hooks) {
  setupTest(hooks);
  let component;

  module('When user is logged', function (hooks) {
    hooks.beforeEach(function () {
      stubSessionService(this.owner, { isAuthenticated: true });
      component = createGlimmerComponent('navbar-mobile-header');
    });

    module('#isUserLogged', function () {
      test('should return true', function (assert) {
        // then
        assert.true(component.isUserLogged);
      });
    });
  });

  module('When user is not logged', function (hooks) {
    hooks.beforeEach(function () {
      stubSessionService(this.owner, { isAuthenticated: false });
      component = createGlimmerComponent('navbar-mobile-header');
    });

    module('#isUserLogged', function () {
      test('should return false, when user is unauthenticated', function (assert) {
        // then
        assert.false(component.isUserLogged);
      });
    });
  });
});
