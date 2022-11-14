import sinon from 'sinon';

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import createGlimmerComponent from '../../../helpers/create-glimmer-component';
import setupIntl from '../../../helpers/setup-intl';

module('Unit | Component | login-form', (hooks) => {
  setupTest(hooks);
  setupIntl(hooks);

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

  module.only('#authenticate', () => {
    const eventStub = { preventDefault: sinon.stub().returns() };

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
        component.authenticate(eventStub);

        // then
        assert.ok(component.args.certificationCenterInvitation.accept.notCalled);
      });

      module('When form is valid', (hooks) => {
        hooks.beforeEach(() => {
          component.email = 'user@example.net';
          component.password = 'pix123';
          component.args.isWithInvitation = true;
          component.args.certificationCenterInvitationId = '1234';
          component.args.certificationCenterInvitationCode = 'ABCD';
        });

        test('should accept organization invitation', function (assert) {
          // given

          component.args.certificationCenterInvitation = {
            accept: sinon.stub().resolves(),
          };

          // when
          component.authenticate(eventStub);

          // then
          sinon.assert.calledWith(component.args.certificationCenterInvitation.accept, {
            id: component.args.certificationCenterInvitationId,
            code: component.args.certificationCenterInvitationCode,
            email: component.email,
          });
          assert.false(component.isErrorMessagePresent);
          assert.strictEqual(component.errorMessage, '');
          assert.ok(true);
        });

        module('When there is an error in accepting invitation but not accepted error', function () {
          test.only('it should display a message error', async function (assert) {
            // given
            component.args.certificationCenterInvitation = {
              accept: sinon.stub().rejects({ errors: [{ status: '400' }] }),
            };

            // when
            component.authenticate(eventStub);

            // then
            console.log(' in test component.isErrorMessagePresent ', component.isErrorMessagePresent);
            //assert.strictEqual(component.errorMessage, this.intl.t('common.api-errors-messages.bad-request'));
            assert.equal(component.isErrorMessagePresent, true);
            //assert.equal(component.isLoading, false);
          });
        });

        test('should authenticate', function (assert) {
          // given
          component.args.certificationCenterInvitation = {
            accept: sinon.stub().resolves(),
          };
          const _authenticateStub = sinon.stub().resolves();
          component._authenticate = _authenticateStub;

          // when
          component.authenticate(eventStub);

          // then
          assert.ok(_authenticateStub.calledWith(component.password, component.email));

          //sinon.assert.calledWith(_authenticateStub, component.password, component.email);
          //component.isErrorMessagePresent = false;
          //component.errorMessage = '';
          assert.ok(true);
        });
      });
    });
  });
});
