import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Services | PassageEvents', function (hooks) {
  setupTest(hooks);

  let clock;
  const now = new Date('2019-04-28T02:42:00Z');

  hooks.beforeEach(function () {
    clock = sinon.useFakeTimers({ now });
  });

  hooks.afterEach(function () {
    clock.restore();
  });

  module('#initialize', function () {
    test('should save passage id', function (assert) {
      // given
      const service = this.owner.lookup('service:passageEvents');

      // when
      service.initialize({ passageId: '1984' });

      // then
      assert.strictEqual(service.passageId, 1984);
    });

    test('should reset passage number', async function (assert) {
      // given
      const service = this.owner.lookup('service:passageEvents');
      service.sequenceNumber = 10;

      // when
      service.initialize({ passageId: '1984' });

      // then
      assert.strictEqual(service.sequenceNumber, 1);
    });
  });

  module('#record', function () {
    test('it should record a passageEvent', async function (assert) {
      // given
      const passageEventService = this.owner.lookup('service:passageEvents');

      const store = this.owner.lookup('service:store');
      sinon.stub(store, 'createRecord');
      const saveStub = sinon.stub().resolves({});
      const passageEventCollection = { save: saveStub };
      store.createRecord.returns(passageEventCollection);
      passageEventService.initialize({ passageId: 1 });

      // when
      await passageEventService.record({
        type: 'FlashcardsStartedEvent',
        data: {
          elementId: '04287d5b-285e-4a67-9fb1-3adbf95deb2f',
        },
      });

      // then
      assert.deepEqual(passageEventCollection.events, [
        {
          type: 'FlashcardsStartedEvent',
          passageId: 1,
          occurredAt: 1556419320000,
          elementId: '04287d5b-285e-4a67-9fb1-3adbf95deb2f',
          sequenceNumber: 2,
        },
      ]);
      assert.true(saveStub.called);
    });

    test('it should increment sequenceNumber when called multiple times', async function (assert) {
      // given
      const passageEventService = this.owner.lookup('service:passageEvents');

      const store = this.owner.lookup('service:store');
      const passageEventCollection1 = { save: sinon.stub() };
      const passageEventCollection2 = { save: sinon.stub() };
      sinon.stub(store, 'createRecord');
      store.createRecord.onCall(0).returns(passageEventCollection1);
      store.createRecord.onCall(1).returns(passageEventCollection2);
      passageEventService.initialize({ passageId: 1 });

      // when
      await passageEventService.record({
        type: 'FlashcardsStartedEvent',
        data: {
          elementId: '04287d5b-285e-4a67-9fb1-3adbf95deb2f',
        },
      });

      await passageEventService.record({
        type: 'FlashcardsRectoSeenEvent',
        passageId: 1,
        data: {
          elementId: '04287d5b-285e-4a67-9fb1-3adbf95deb2f',
        },
      });

      assert.strictEqual(passageEventCollection1.events[0].sequenceNumber, 2);
      assert.strictEqual(passageEventCollection2.events[0].sequenceNumber, 3);
    });
  });
});
