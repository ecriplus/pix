import EmberObject from '@ember/object';
import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Controller | authenticated/sessions/session/certifications', function (hooks) {
  setupTest(hooks);
  let controller;
  let model;
  let pixToastSendSuccessNotification;
  let pixToastSendErrorNotification;
  let store;

  hooks.beforeEach(function () {
    controller = this.owner.lookup('controller:authenticated/sessions/session/certifications');
    model = EmberObject.create({
      id: Symbol('an id'),
      certifications: [{}, {}],
      session: {
        id: Symbol('session id'),
        isPublished: false,
        save: sinon.stub(),
      },
      juryCertificationSummaries: {
        reload: sinon.stub(),
      },
    });
    controller.set('model', model);
    pixToastSendSuccessNotification = sinon.stub();
    pixToastSendErrorNotification = sinon.stub();
    class PixToastStub extends Service {
      sendSuccessNotification = pixToastSendSuccessNotification;
      sendErrorNotification = pixToastSendErrorNotification;
    }
    this.owner.register('service:pixToast', PixToastStub);

    store = this.owner.lookup('service:store');
    store.findRecord = sinon.stub().resolves();
  });

  module('#publishSession', function () {
    module('when publish succeeded', function () {
      test('should notify success and refresh model', async function (assert) {
        // given
        model.session.save.resolves();

        // when
        await controller.publishSession();

        // then
        assert.ok(
          model.session.save.calledOnceWith({
            adapterOptions: { updatePublishedCertifications: true, toPublish: true },
          }),
        );
        assert.ok(store.findRecord.calledOnceWith('session', model.session.id, { reload: true }));
      });
    });
    module('when publish failed', function () {
      test('should notify failure and refresh model', async function (assert) {
        // given
        model.session.save.rejects();

        const store = this.owner.lookup('service:store');
        store.findRecord = sinon.stub().resolves();

        // when
        await controller.publishSession();

        // then
        assert.ok(
          model.session.save.calledOnceWith({
            adapterOptions: { updatePublishedCertifications: true, toPublish: true },
          }),
        );
        assert.ok(pixToastSendErrorNotification.calledOnce);
        assert.ok(store.findRecord.calledOnceWith('session', model.session.id, { reload: true }));
      });
    });
  });

  module('#unpublishSession', function () {
    module('when unpublish succeeded', function () {
      test('should notify success and refresh model', async function (assert) {
        // given
        model.session.save.resolves();

        // when
        await controller.unpublishSession();

        // then
        assert.ok(
          model.session.save.calledOnceWith({
            adapterOptions: { updatePublishedCertifications: true, toPublish: false },
          }),
        );
        assert.ok(model.juryCertificationSummaries.reload.calledOnce);
        assert.ok(pixToastSendSuccessNotification.calledOnce);
        assert.ok(store.findRecord.calledOnceWith('session', model.session.id, { reload: true }));
      });
    });
    module('when unpublish failed', function () {
      test('should notify failure and refresh model', async function (assert) {
        // given
        model.session.save.rejects();

        const store = this.owner.lookup('service:store');
        store.findRecord = sinon.stub().resolves();

        // when
        await controller.unpublishSession();

        // then
        assert.ok(
          model.session.save.calledOnceWith({
            adapterOptions: { updatePublishedCertifications: true, toPublish: false },
          }),
        );
        assert.notOk(model.juryCertificationSummaries.reload.calledOnce);
        assert.ok(pixToastSendErrorNotification.calledOnce);
        assert.ok(store.findRecord.calledOnceWith('session', model.session.id, { reload: true }));
      });
    });
  });
});
