import { module, test } from 'qunit';
import sinon from 'sinon';
import { setupTest } from 'ember-qunit';
import createGlimmerComponent from 'mon-pix/tests/helpers/create-glimmer-component';

module('Unit | Component | routes/login-form', function (hooks) {
  setupTest(hooks);

  let sessionStub;
  let storeStub;
  let routerStub;

  let component;
  let addGarAuthenticationMethodToUserStub;

  const eventStub = { preventDefault: sinon.stub() };

  hooks.beforeEach(function () {
    sessionStub = {
      authenticate: sinon.stub().resolves(),
      isAuthenticated: sinon.stub().returns(true),
      get: sinon.stub(),
      invalidate: sinon.stub(),
    };
    routerStub = {
      replaceWith: sinon.stub(),
    };
    storeStub = {
      createRecord: sinon.stub(),
    };

    addGarAuthenticationMethodToUserStub = sinon.stub();

    component = createGlimmerComponent('component:routes/login-form');
    component.session = sessionStub;
    component.store = storeStub;
    component.router = routerStub;

    component.args.addGarAuthenticationMethodToUser = addGarAuthenticationMethodToUserStub;
  });

  module('#authenticate', function () {
    module('when user is a Pix user', function () {
      test('should not notify error when authentication succeeds', async function (assert) {
        // when
        await component.authenticate(eventStub);

        // then
        assert.false(component.isErrorMessagePresent);
        assert.false(component.hasUpdateUserError);
      });

      test('should notify error when authentication fails', async function (assert) {
        // given
        sessionStub.authenticate.rejects(new Error());

        // when
        await component.authenticate(eventStub);

        // then
        assert.true(component.isErrorMessagePresent);
        assert.false(component.hasUpdateUserError);
      });

      module('when user should change password', function () {
        test('should save reset password token and redirect to update-expired-password', async function (assert) {
          // given
          const expectedRouteName = 'update-expired-password';
          sessionStub.authenticate.rejects({
            responseJSON: {
              errors: [
                {
                  title: 'PasswordShouldChange',
                  meta: 'PASSWORD_RESET_TOKEN',
                },
              ],
            },
          });

          // when
          await component.authenticate(eventStub);

          // then
          sinon.assert.calledWith(storeStub.createRecord, 'reset-expired-password-demand', {
            passwordResetToken: 'PASSWORD_RESET_TOKEN',
          });
          sinon.assert.calledWith(component.router.replaceWith, expectedRouteName);
          assert.ok(true);
        });
      });
    });

    module('when user is external with an existing token id', function (hooks) {
      const externalUserToken = 'ABCD';
      const expectedUserId = 1;

      hooks.beforeEach(() => {
        sessionStub.get.withArgs('data.externalUser').returns(externalUserToken);
        sessionStub.get.withArgs('data.expectedUserId').returns(expectedUserId);
      });

      test('should display an error message when update user authentication method fails', async function (assert) {
        // given
        addGarAuthenticationMethodToUserStub.rejects(new Error());

        // when
        await component.authenticate(eventStub);

        // then
        assert.false(component.isErrorMessagePresent);
        assert.true(component.hasUpdateUserError);
      });

      module('when user should change password', function () {
        test('should save reset password token and redirect to update-expired-password', async function (assert) {
          // given
          const response = {
            errors: [
              {
                title: 'PasswordShouldChange',
                meta: 'PASSWORD_RESET_TOKEN',
              },
            ],
          };
          addGarAuthenticationMethodToUserStub.rejects(response);

          // when
          await component.authenticate(eventStub);

          // then
          sinon.assert.calledWith(storeStub.createRecord, 'reset-expired-password-demand', {
            passwordResetToken: 'PASSWORD_RESET_TOKEN',
          });
          sinon.assert.calledWith(component.router.replaceWith, 'update-expired-password');
          assert.ok(true);
        });
      });
    });
  });
});
