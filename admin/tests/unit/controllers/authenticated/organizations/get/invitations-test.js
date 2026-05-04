import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Controller | authenticated/organizations/get/invitations', function (hooks) {
  setupTest(hooks);

  let controller, store, sendInvitationStub, reloadStub, locale, role;

  hooks.beforeEach(function () {
    controller = this.owner.lookup('controller:authenticated/organizations/get/invitations');
    reloadStub = sinon.stub();

    controller.model = {
      organization: {
        id: 1,
        hasMany: sinon.stub(),
      },
    };
    controller.model.organization.hasMany.withArgs('organizationInvitations').returns({
      reload: reloadStub,
    });

    controller.userEmailToInvite = 'test@example.net';

    store = this.owner.lookup('service:store');
    store.adapterFor = sinon.stub();
    sendInvitationStub = sinon.stub();
    store.adapterFor.withArgs('organization-invitation').returns({ sendInvitation: sendInvitationStub });

    locale = 'fr';
    role = 'METIER';
  });

  module('#createOrganizationInvitation', function () {
    test('it should call sendInvitation adapter method and reload model if the email is valid', async function (assert) {
      // given
      sendInvitationStub.resolves();

      const invitationData = { email: controller.userEmailToInvite, locale, role };

      // when
      await controller.createOrganizationInvitation(locale, role);

      // then
      assert.ok(sendInvitationStub.calledOnceWith({ ...invitationData, organizationId: 1 }));

      assert.true(reloadStub.calledOnce);
    });

    test('it should fail if userEmailToInvite is undefined', function (assert) {
      // given
      controller.userEmailToInvite = undefined;

      // when
      controller.createOrganizationInvitation(locale, role);

      // then
      assert.strictEqual(controller.userEmailToInviteError, 'Ce champ est requis.');
    });

    test('it should fail if userEmailToInvite is empty', function (assert) {
      // given
      controller.userEmailToInvite = '';

      // when
      controller.createOrganizationInvitation(locale, role);

      // then
      assert.strictEqual(controller.userEmailToInviteError, 'Ce champ est requis.');
    });

    test('it should fail if userEmailToInvite is not a valid email address', function (assert) {
      // given
      controller.userEmailToInvite = 'not_valid_email';

      // when
      controller.createOrganizationInvitation(locale, role);

      // then
      assert.strictEqual(controller.userEmailToInviteError, "L'adresse e-mail saisie n'est pas valide.");
    });

    test('it should send a notification error if an error occurred', async function (assert) {
      // given
      const anError = Symbol('an error');
      sendInvitationStub.rejects(anError);

      const notifyStub = sinon.stub();
      class ErrorResponseHandler extends Service {
        notify = notifyStub;
      }
      this.owner.register('service:error-response-handler', ErrorResponseHandler);
      const customErrors = Symbol('custom errors');
      controller.CUSTOM_ERROR_MESSAGES = customErrors;

      // when
      await controller.createOrganizationInvitation(locale, role);

      // then
      assert.ok(notifyStub.calledWithExactly(anError, customErrors));
    });
  });

  module('#sendNewInvitation', function () {
    test('sends a new invitation by calling sendInvitation method from adapter', function (assert) {
      // given
      controller.model = { organization: { id: 1 } };
      const organizationInvitation = { email: 'test@example.net', locale: 'en', role: 'MEMBER' };

      // when
      controller.sendNewInvitation(organizationInvitation);

      // then
      assert.ok(sendInvitationStub.calledOnceWith({ ...organizationInvitation, organizationId: 1 }));
    });

    test('When an error occurs, it should send a notification error', async function (assert) {
      // given
      const controller = this.owner.lookup('controller:authenticated/organizations/get/invitations');

      const anError = Symbol('an error');
      sendInvitationStub.rejects(anError);
      const notifyStub = sinon.stub();
      class ErrorResponseHandler extends Service {
        notify = notifyStub;
      }
      this.owner.register('service:error-response-handler', ErrorResponseHandler);
      const customErrors = Symbol('custom errors');
      controller.CUSTOM_ERROR_MESSAGES = customErrors;
      controller.model = { organization: { id: 1 } };
      const organizationInvitation = { email: 'test@example.net', locale: 'en', role: 'MEMBER' };

      // when
      await controller.sendNewInvitation(organizationInvitation);

      // then
      assert.ok(notifyStub.calledWithExactly(anError, customErrors));
    });
  });
});
