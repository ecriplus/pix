import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Service | join invitation', function (hooks) {
  setupTest(hooks);

  let store;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
  });

  module('invitation', function () {});

  module('load', function () {
    test('loads and returns an invitation', async function (assert) {
      // Given
      sinon.stub(store, 'queryRecord').resolves({ organizationName: 'My awesome organization' });
      const joinInvitation = this.owner.lookup('service:joinInvitation');

      // When
      const invitation = await joinInvitation.load({ invitationId: '123', code: '456' });

      // Then
      assert.strictEqual(joinInvitation.error, null);
      assert.deepEqual(invitation, {
        invitationId: '123',
        code: '456',
        organizationName: 'My awesome organization',
      });
      assert.deepEqual(joinInvitation.invitation, {
        invitationId: '123',
        code: '456',
        organizationName: 'My awesome organization',
      });
    });

    module('when an invitation is cancelled', function () {
      test('sets INVITATION_CANCELLED error code', async function (assert) {
        // Given
        sinon.stub(store, 'queryRecord').rejects({ errors: [{ status: '403' }] });
        const joinInvitation = this.owner.lookup('service:joinInvitation');

        // When
        const invitation = await joinInvitation.load({ invitationId: '123', code: '456' });

        // Then
        assert.strictEqual(joinInvitation.error, 'INVITATION_CANCELLED');
        assert.strictEqual(invitation, undefined);
        assert.strictEqual(joinInvitation.invitation, undefined);
      });
    });

    module('when an invitation is already accepted', function () {
      test('sets INVITATION_ALREADY_ACCEPTED error code', async function (assert) {
        // Given
        sinon.stub(store, 'queryRecord').rejects({ errors: [{ status: '412' }] });
        const joinInvitation = this.owner.lookup('service:joinInvitation');

        // When
        const invitation = await joinInvitation.load({ invitationId: '123', code: '456' });

        // Then
        assert.strictEqual(joinInvitation.error, 'INVITATION_ALREADY_ACCEPTED');
        assert.strictEqual(invitation, undefined);
        assert.strictEqual(joinInvitation.invitation, undefined);
      });
    });
  });

  module('acceptInvitationByUserId', function () {
    test('accepts an invitation', async function (assert) {
      // Given
      const saveStub = sinon.stub();
      const deleteStub = sinon.stub();
      sinon.stub(store, 'queryRecord').resolves({ organizationName: 'My awesome organization' });
      sinon.stub(store, 'peekRecord').returns();
      sinon.stub(store, 'createRecord').returns({ save: saveStub, deleteRecord: deleteStub });
      const joinInvitation = this.owner.lookup('service:joinInvitation');
      await joinInvitation.load({ invitationId: '123', code: '456' });

      // When
      await joinInvitation.acceptInvitationByUserId(1234);

      // Then
      assert.ok(saveStub.calledWith({ adapterOptions: { organizationInvitationId: '123' } }));
      assert.strictEqual(joinInvitation.invitation, undefined);
    });
  });
});
