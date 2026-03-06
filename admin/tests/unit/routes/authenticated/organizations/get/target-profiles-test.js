import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/organizations/get/target-profiles', function (hooks) {
  setupTest(hooks);

  let route;

  hooks.beforeEach(function () {
    route = this.owner.lookup('route:authenticated/organizations/get/target-profiles');

    route.pixToast = {
      sendSuccessNotification: sinon.stub(),
      sendWarningNotification: sinon.stub(),
      sendErrorNotification: sinon.stub(),
    };
    route.intl = { t: sinon.stub().returns('Une erreur est survenue.') };
  });

  module('#attachTargetProfiles', function () {
    test('it attaches target profiles and refreshes the model', async function (assert) {
      // given
      const adapter = this.owner.lookup('service:store').adapterFor('organization');
      const attachTargetProfileStub = sinon.stub(adapter, 'attachTargetProfile').resolves();
      const refreshStub = sinon.stub(route, 'refresh');

      route.currentModel = {
        organization: { id: '1' },
        targetProfileSummaries: [],
      };

      // when
      await route.attachTargetProfiles(['42']);

      // then
      assert.ok(attachTargetProfileStub.calledWith({ organizationId: '1', targetProfileIds: ['42'] }));
      assert.ok(refreshStub.calledOnce);
    });

    test('it shows a singular success notification when one profile is new', async function (assert) {
      // given
      const adapter = this.owner.lookup('service:store').adapterFor('organization');
      sinon.stub(adapter, 'attachTargetProfile').resolves();
      sinon.stub(route, 'refresh');

      route.currentModel = {
        organization: { id: '1' },
        targetProfileSummaries: [],
      };

      // when
      await route.attachTargetProfiles(['42']);

      // then
      assert.ok(
        route.pixToast.sendSuccessNotification.calledWith({
          message: 'Le profil cible 42 a été rattaché avec succès.',
        }),
      );
    });

    test('it shows a plural success notification when multiple profiles are new', async function (assert) {
      // given
      const adapter = this.owner.lookup('service:store').adapterFor('organization');
      sinon.stub(adapter, 'attachTargetProfile').resolves();
      sinon.stub(route, 'refresh');

      route.currentModel = {
        organization: { id: '1' },
        targetProfileSummaries: [],
      };

      // when
      await route.attachTargetProfiles(['42', '43']);

      // then
      assert.ok(
        route.pixToast.sendSuccessNotification.calledWith({
          message: 'Les profils cibles suivants ont été rattachés avec succès : 42, 43.',
        }),
      );
    });

    test('it shows a singular warning notification when one profile is already attached', async function (assert) {
      // given
      const adapter = this.owner.lookup('service:store').adapterFor('organization');
      sinon.stub(adapter, 'attachTargetProfile').resolves();
      sinon.stub(route, 'refresh');

      route.currentModel = {
        organization: { id: '1' },
        targetProfileSummaries: [{ id: '42' }],
      };

      // when
      await route.attachTargetProfiles(['42']);

      // then
      assert.ok(
        route.pixToast.sendWarningNotification.calledWith({
          message: 'Le profil cible 42 est déjà rattaché à cette organisation.',
        }),
      );
    });

    test('it shows a plural warning notification when multiple profiles are already attached', async function (assert) {
      // given
      const adapter = this.owner.lookup('service:store').adapterFor('organization');
      sinon.stub(adapter, 'attachTargetProfile').resolves();
      sinon.stub(route, 'refresh');

      route.currentModel = {
        organization: { id: '1' },
        targetProfileSummaries: [{ id: '42' }, { id: '43' }],
      };

      // when
      await route.attachTargetProfiles(['42', '43']);

      // then
      assert.ok(
        route.pixToast.sendWarningNotification.calledWith({
          message: 'Les profils cibles suivants sont déjà rattachés à cette organisation : 42, 43.',
        }),
      );
    });

    test('it shows both success and warning notifications when some profiles are new and some are duplicates', async function (assert) {
      // given
      const adapter = this.owner.lookup('service:store').adapterFor('organization');
      sinon.stub(adapter, 'attachTargetProfile').resolves();
      sinon.stub(route, 'refresh');

      route.currentModel = {
        organization: { id: '1' },
        targetProfileSummaries: [{ id: '10' }],
      };

      // when
      await route.attachTargetProfiles(['10', '42']);

      // then
      assert.ok(
        route.pixToast.sendSuccessNotification.calledWith({
          message: 'Le profil cible 42 a été rattaché avec succès.',
        }),
      );
      assert.ok(
        route.pixToast.sendWarningNotification.calledWith({
          message: 'Le profil cible 10 est déjà rattaché à cette organisation.',
        }),
      );
    });

    test('it shows an error notification when the request fails', async function (assert) {
      // given
      const adapter = this.owner.lookup('service:store').adapterFor('organization');
      sinon
        .stub(adapter, 'attachTargetProfile')
        .callsFake(() => Promise.reject({ errors: [{ status: '404', detail: 'Not found' }] }));
      sinon.stub(route, 'refresh');

      route.currentModel = {
        organization: { id: '1' },
        targetProfileSummaries: [],
      };

      await route.attachTargetProfiles(['99']);

      // then
      assert.ok(route.pixToast.sendErrorNotification.calledOnce);
      assert.ok(route.refresh.notCalled);
    });
  });

  module('#detachTargetProfile', function () {
    test('it detaches a target profile and refreshes the model', async function (assert) {
      // given
      const adapter = this.owner.lookup('service:store').adapterFor('target-profile');
      const detachOrganizationsStub = sinon.stub(adapter, 'detachOrganizations').resolves();
      sinon.stub(route, 'refresh');

      route.currentModel = {
        organization: { id: '1' },
      };

      // when
      await route.detachTargetProfile('42');

      // then
      assert.ok(detachOrganizationsStub.calledWith('42', ['1']));
      assert.ok(route.refresh.calledOnce);
    });

    test('it shows a success notification with the target profile id', async function (assert) {
      // given
      const adapter = this.owner.lookup('service:store').adapterFor('target-profile');
      sinon.stub(adapter, 'detachOrganizations').resolves();
      sinon.stub(route, 'refresh');

      route.currentModel = {
        organization: { id: '1' },
      };

      // when
      await route.detachTargetProfile('42');

      // then
      assert.ok(route.pixToast.sendSuccessNotification.calledWith({ message: 'Profil cible 42 détaché avec succès.' }));
    });

    test('it shows an error notification when the request fails', async function (assert) {
      // given
      const adapter = this.owner.lookup('service:store').adapterFor('target-profile');
      sinon
        .stub(adapter, 'detachOrganizations')
        .callsFake(() => Promise.reject({ errors: [{ status: '412', detail: 'Conflict' }] }));
      sinon.stub(route, 'refresh');

      route.currentModel = {
        organization: { id: '1' },
      };

      // when
      await route.detachTargetProfile('42');

      // then
      assert.ok(route.pixToast.sendErrorNotification.calledWith({ message: 'Conflict' }));
      assert.ok(route.refresh.notCalled);
    });
  });
});
