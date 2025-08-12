import Service from '@ember/service';
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

      const requestManager = this.owner.lookup('service:request-manager');
      const requestStub = sinon.stub(requestManager, 'request');
      passageEventService.initialize({ passageId: 1 });

      class PreviewModeServiceStub extends Service {
        isEnabled = false;
      }
      this.owner.register('service:modulixPreviewMode', PreviewModeServiceStub);

      // when
      await passageEventService.record({
        type: 'FlashcardsStartedEvent',
        data: {
          elementId: '04287d5b-285e-4a67-9fb1-3adbf95deb2f',
        },
      });

      // then
      sinon.assert.calledWithExactly(requestStub, {
        url: 'http://localhost:3000/api/passage-events',
        method: 'POST',
        body: JSON.stringify({
          data: {
            attributes: {
              events: [
                {
                  type: 'FlashcardsStartedEvent',
                  'passage-id': 1,
                  'sequence-number': 2,
                  'occurred-at': now.getTime(),
                  elementId: '04287d5b-285e-4a67-9fb1-3adbf95deb2f',
                },
              ],
            },
          },
        }),
      });
      assert.ok(true);
    });

    test('it should increment sequenceNumber when called multiple times', async function (assert) {
      // given
      const passageEventService = this.owner.lookup('service:passageEvents');
      const requestManager = this.owner.lookup('service:request-manager');
      const requestStub = sinon.stub(requestManager, 'request');
      passageEventService.initialize({ passageId: 1 });

      class PreviewModeServiceStub extends Service {
        isEnabled = false;
      }
      this.owner.register('service:modulixPreviewMode', PreviewModeServiceStub);

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
      sinon.assert.calledWithExactly(requestStub.getCall(0), {
        url: 'http://localhost:3000/api/passage-events',
        method: 'POST',
        body: JSON.stringify({
          data: {
            attributes: {
              events: [
                {
                  type: 'FlashcardsStartedEvent',
                  'passage-id': 1,
                  'sequence-number': 2,
                  'occurred-at': now.getTime(),
                  elementId: '04287d5b-285e-4a67-9fb1-3adbf95deb2f',
                },
              ],
            },
          },
        }),
      });
      sinon.assert.calledWithExactly(requestStub.getCall(1), {
        url: 'http://localhost:3000/api/passage-events',
        method: 'POST',
        body: JSON.stringify({
          data: {
            attributes: {
              events: [
                {
                  type: 'FlashcardsRectoSeenEvent',
                  'passage-id': 1,
                  'sequence-number': 3,
                  'occurred-at': now.getTime(),
                  elementId: '04287d5b-285e-4a67-9fb1-3adbf95deb2f',
                },
              ],
            },
          },
        }),
      });
      assert.ok(true);
    });

    module('when preview mode is enabled', function () {
      test('should not record a passageEvent', async function (assert) {
        // given
        const passageEventService = this.owner.lookup('service:passageEvents');
        const requestManager = this.owner.lookup('service:request-manager');
        const requestStub = sinon.stub(requestManager, 'request');
        passageEventService.initialize({ passageId: 1 });

        class PreviewModeServiceStub extends Service {
          isEnabled = true;
        }
        this.owner.register('service:modulixPreviewMode', PreviewModeServiceStub);

        // when
        await passageEventService.record({
          type: 'FlashcardsRectoSeenEvent',
          passageId: 1,
          data: {
            elementId: '04287d5b-285e-4a67-9fb1-3adbf95deb2f',
          },
        });

        // then
        sinon.assert.notCalled(requestStub);
        assert.ok(true);
      });
    });
  });
});
