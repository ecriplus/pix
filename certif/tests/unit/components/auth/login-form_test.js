import sinon from 'sinon';

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import createGlimmerComponent from '../../../helpers/create-glimmer-component';

module('Unit | Component | login-form', (hooks) => {
  setupTest(hooks);

  let component;

  hooks.beforeEach(function () {
    component = createGlimmerComponent('component:auth/login-form');
  });

  module('#updateEmail', () => {
    test('should update email without spaces', function (assert) {
      // given
      const emailWithSpaces = '    user@example.net  ';
      const event = { target: { value: emailWithSpaces } };

      // when
      component.updateEmail(event);

      // then
      const expectedEmail = emailWithSpaces.trim();
      assert.strictEqual(component.email, expectedEmail);
    });
  });

  module('#authenticate', () => {
    module('When there is an invitation', () => {
      test('should not accept organization invitation when form is invalid', function (assert) {
        // given
        component.email = '';
        component.password = 'pix123';
        component.args.isWithInvitation = true;
        component.args.certificationCenterInvitation = {
          accept: sinon.stub().resolves(),
        };

        // when
        component.authenticate(new Event('stub'));

        // then
        assert.ok(component.args.certificationCenterInvitation.accept.notCalled);
      });
      // cas ou le form est valid > intégration
    });
  });
});
