import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';
import sinon from 'sinon';

module('Unit | Controller | authenticated/certification-centers/get', function (hooks) {
  setupTest(hooks);

  let certificationCenter;
  let createRecordStub;
  let saveStub;

  let controller;

  hooks.beforeEach(function () {
    sinon.restore();

    controller = this.owner.lookup('controller:authenticated/certification-centers/get');

    createRecordStub = sinon.stub();
    saveStub = sinon.stub();

    saveStub.resolves();
    createRecordStub.returns({
      save: saveStub,
    });

    const store = this.owner.lookup('service:store');
    const testAccreditation = store.createRecord('accreditation', { name: 'Accreditation test' });

    certificationCenter = store.createRecord('certification-center', {
      id: 1,
      name: 'Centre des Anne-Etoiles',
      type: 'PRO',
      externalId: 'ex123',
      accreditations: [testAccreditation],
    });

    controller.store = Service.create({
      createRecord: createRecordStub,
    });

    controller.model = {
      certificationCenter,
    };

    controller.notifications = {
      success: sinon.stub(),
      error: sinon.stub(),
    };
    controller.notifications.success.resolves();
    controller.notifications.error.resolves();
  });

  module('#updateEmailErrorMessage', function () {
    test('should set email error message if email syntax is invalid', function (assert) {
      // given
      controller.userEmailToAdd = 'an invalid email';

      // when
      controller.send('updateEmailErrorMessage');

      // then
      assert.equal(controller.errorMessage, controller.EMAIL_INVALID_ERROR_MESSAGE);
    });

    test('should set email error message to null if email is empty', function (assert) {
      // given
      controller.errorMessage = 'error message';
      controller.userEmailToAdd = '';

      // when
      controller.send('updateEmailErrorMessage');

      // then
      assert.equal(controller.errorMessage, null);
    });
  });

  module('#addCertificationCenterMembership', function (hooks) {
    let event;

    hooks.beforeEach(function () {
      event = { preventDefault() {} };
      controller.send = sinon.stub();
    });

    module('when email is valid', function () {
      const emailWithSpaces = ' test@example.net ';

      test('should create a certificationCenterMembership', async function (assert) {
        // given
        controller.userEmailToAdd = emailWithSpaces;
        const expectedArguments = {
          adapterOptions: {
            createByEmail: true,
            certificationCenterId: certificationCenter.id,
            email: emailWithSpaces.trim(),
          },
        };

        // when
        await controller.addCertificationCenterMembership(event);

        // then
        sinon.assert.calledWith(createRecordStub, 'certification-center-membership');
        sinon.assert.calledWith(saveStub, expectedArguments);
        sinon.assert.calledWith(controller.send, 'refreshModel');
        assert.ok(true);
      });

      test('should not set any error message', async function (assert) {
        // given
        controller.userEmailToAdd = emailWithSpaces;

        // when
        await controller.addCertificationCenterMembership(event);

        // then
        assert.equal(controller.errorMessage, null);
      });

      test('should send success notification', async function (assert) {
        // given
        controller.userEmailToAdd = emailWithSpaces;

        // when
        await controller.addCertificationCenterMembership(event);

        // then
        sinon.assert.called(controller.notifications.success);
        assert.ok(true);
      });
    });

    module('when email is not valid', function () {
      test('should be disabled if the email is empty', async function (assert) {
        // given
        controller.userEmailToAdd = '';

        // when
        await controller.addCertificationCenterMembership(event);

        // then
        assert.true(controller.isDisabled);
      });

      test('should set error message if the email is empty', async function (assert) {
        // given
        controller.userEmailToAdd = '';

        // when
        await controller.addCertificationCenterMembership(event);

        // then
        assert.equal(controller.errorMessage, controller.EMAIL_REQUIRED_ERROR_MESSAGE);
      });

      test('should set error message if the email syntax is invalid', async function (assert) {
        // given
        controller.userEmailToAdd = 'an invalid email';

        // when
        await controller.addCertificationCenterMembership(event);

        // then
        assert.equal(controller.errorMessage, controller.EMAIL_INVALID_ERROR_MESSAGE);
      });
    });

    module('when API response is not OK (201)', function () {
      module('when the response error does not contains any errors property', function () {
        test('should send default error notification', async function (assert) {
          // given
          controller.userEmailToAdd = 'test@example.net';
          saveStub.rejects({});

          // when
          await controller.addCertificationCenterMembership(event);

          // then
          sinon.assert.calledWith(controller.notifications.error, controller.ERROR_MESSAGES.DEFAULT);
          assert.ok(true);
        });
      });

      module('when the response error contains an errors property', () => {
        test('should send a specific error notification for http error 400, 404 and 412', async function (assert) {
          // given
          const responseError = {
            errors: [{ status: '400' }, { status: '404' }, { status: '412' }],
          };

          controller.userEmailToAdd = 'test@example.net';
          saveStub.throws(responseError);

          // when
          await controller.addCertificationCenterMembership(event);

          // then
          sinon.assert.calledWith(controller.notifications.error, controller.ERROR_MESSAGES.STATUS_400);
          sinon.assert.calledWith(controller.notifications.error, controller.ERROR_MESSAGES.STATUS_404);
          sinon.assert.calledWith(controller.notifications.error, controller.ERROR_MESSAGES.STATUS_412);
          assert.ok(true);
        });
      });
    });
  });

  module('#updateGrantedAccreditation', function () {
    test('it should add the accreditation to the certification center', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const cleaAccreditation = store.createRecord('accreditation', { name: 'Pix+clea' });

      // when
      controller.updateGrantedAccreditation(cleaAccreditation);

      // then
      assert.true(controller.model.certificationCenter.accreditations.includes(cleaAccreditation));
    });

    test('it should remove the accreditation from the certification center', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const pixSurfAccreditation = store.createRecord('accreditation', { name: 'Pix+Surf' });

      certificationCenter = store.createRecord('certification-center', {
        id: 2,
        name: 'Centre des Anne-surfeuses',
        type: 'PRO',
        externalId: 'ex313',
        accreditations: [pixSurfAccreditation],
      });

      controller.model = {
        certificationCenter,
      };

      // when
      controller.updateGrantedAccreditation(pixSurfAccreditation);

      // then
      assert.false(controller.model.certificationCenter.accreditations.includes(pixSurfAccreditation));
    });
  });
});
