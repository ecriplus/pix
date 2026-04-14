import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Model | Email-Verification-Code', function (hooks) {
  setupTest(hooks);

  test('exists', function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const emailVerificationCode = store.createRecord('email-verification-code');

    // when & then
    assert.ok(emailVerificationCode);
  });

  module('When action attribute is add-email', function () {
    test('calls /add-email-connection-method route', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const emailVerificationCode = store.createRecord('email-verification-code', {
        code: '123456',
        action: 'add-email',
      });
      emailVerificationCode._verifyCodeToAddEmail = sinon.stub();
      emailVerificationCode._verifyCodeToUpdateEmail = sinon.stub();

      //when
      await emailVerificationCode.verifyCode();

      //
      sinon.assert.calledOnce(emailVerificationCode._verifyCodeToAddEmail);
      sinon.assert.notCalled(emailVerificationCode._verifyCodeToUpdateEmail);
      assert.ok(true);
    });
  });

  module('When action attribute is update-email', function () {
    test('calls /update-email route', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const emailVerificationCode = store.createRecord('email-verification-code', {
        code: '123456',
        action: 'update-email',
      });
      emailVerificationCode._verifyCodeToAddEmail = sinon.stub();
      emailVerificationCode._verifyCodeToUpdateEmail = sinon.stub();

      // when
      await emailVerificationCode.verifyCode();

      // then
      sinon.assert.calledOnce(emailVerificationCode._verifyCodeToUpdateEmail);
      sinon.assert.notCalled(emailVerificationCode._verifyCodeToAddEmail);
      assert.ok(true);
    });
  });
});
