import { setupTest } from 'ember-qunit';
import ENV from 'mon-pix/config/environment';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Service | pix-companion', function (hooks) {
  setupTest(hooks);
  let pixCompanion;

  hooks.beforeEach(function () {
    pixCompanion = this.owner.lookup('service:pix-companion');
    ENV.companion.disabled = false;
  });

  hooks.afterEach(function () {
    ENV.companion.disabled = true;
  });

  module('#startCertification', function () {
    test('call the window.postMessage and window.dispatchEvent with certification start event', function (assert) {
      // Given
      const windowStub = {
        dispatchEvent: sinon.stub(),
        postMessage: sinon.stub(),
        location: { origin: 'test' },
      };

      // When
      pixCompanion.startCertification(windowStub);

      // Then
      sinon.assert.calledWith(windowStub.dispatchEvent, new CustomEvent('pix:certification:start'));
      sinon.assert.calledWith(windowStub.postMessage, { event: 'pix:certification:start' }, 'test');
      assert.ok(true);
    });

    module('when Pix Companion is disabled', function () {
      test('do nothing', async function (assert) {
        // Given
        ENV.companion.disabled = true;
        const windowStub = {
          dispatchEvent: sinon.stub(),
          postMessage: sinon.stub(),
          location: { origin: 'test' },
        };

        // When
        pixCompanion.startCertification(windowStub);

        // Then
        sinon.assert.notCalled(windowStub.dispatchEvent);
        sinon.assert.notCalled(windowStub.postMessage);
        assert.ok(true);
      });
    });
  });

  module('#stopCertification', function () {
    test('call the window.postMessage and window.dispatchEvent with certification stop event', function (assert) {
      // Given
      const windowStub = {
        dispatchEvent: sinon.stub(),
        postMessage: sinon.stub(),
        location: { origin: 'test' },
      };

      // When
      pixCompanion.stopCertification(windowStub);

      // Then
      sinon.assert.calledWith(windowStub.dispatchEvent, new CustomEvent('pix:certification:stop'));
      sinon.assert.calledWith(windowStub.postMessage, { event: 'pix:certification:stop' }, 'test');
      assert.ok(true);
    });

    module('when Pix Companion is disabled', function () {
      test('do nothing', async function (assert) {
        // Given
        ENV.companion.disabled = true;
        const windowStub = {
          dispatchEvent: sinon.stub(),
          postMessage: sinon.stub(),
          location: { origin: 'test' },
        };

        // When
        pixCompanion.stopCertification(windowStub);

        // Then
        sinon.assert.notCalled(windowStub.dispatchEvent);
        sinon.assert.notCalled(windowStub.postMessage);
        assert.ok(true);
      });
    });
  });

  module('#checkExtensionIsEnabled', function () {
    test('set isExtensionEnabled to true if pong is received', async function (assert) {
      // Given
      const windowStub = {
        addEventListener: sinon.stub(),
        dispatchEvent: sinon.stub(),
        removeEventListener: sinon.stub(),
        setTimeout: sinon.stub(),
      };
      windowStub.addEventListener.callsFake((type, listener) => {
        assert.strictEqual(type, 'pix:companion:pong');
        listener();
      });
      pixCompanion._isExtensionEnabled = false;

      // When
      pixCompanion.checkExtensionIsEnabled(windowStub);
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Then
      sinon.assert.calledWith(windowStub.dispatchEvent, new CustomEvent('pix:companion:ping'));
      assert.true(pixCompanion.isExtensionEnabled);
    });

    test('set isExtensionEnabled to false and emit block event if pong is NOT received', async function (assert) {
      // Given
      const windowStub = {
        addEventListener: sinon.stub(),
        dispatchEvent: sinon.stub(),
        removeEventListener: sinon.stub(),
        setTimeout: sinon.stub(),
      };
      windowStub.setTimeout.callsFake((callback, timeout) => {
        assert.strictEqual(timeout, 500);
        callback();
      });
      pixCompanion._isExtensionEnabled = true;
      let blockEventReceived = false;
      pixCompanion.addEventListener(
        'block',
        () => {
          blockEventReceived = true;
        },
        { once: true },
      );

      // When
      pixCompanion.checkExtensionIsEnabled(windowStub);
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Then
      sinon.assert.calledWith(windowStub.dispatchEvent, new CustomEvent('pix:companion:ping'));
      assert.false(pixCompanion.isExtensionEnabled);
      assert.true(blockEventReceived);
    });
  });

  module('#startCheckingExtensionIsEnabled', function () {
    module('when Pix Companion is disabled', function () {
      test('do nothing', async function (assert) {
        // Given
        const windowStub = {
          addEventListener: sinon.stub(),
          dispatchEvent: sinon.stub(),
          removeEventListener: sinon.stub(),
          setInterval: sinon.stub(),
          setTimeout: sinon.stub(),
        };
        ENV.companion.disabled = true;

        // When
        pixCompanion.startCheckingExtensionIsEnabled(windowStub);
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Then
        sinon.assert.notCalled(windowStub.addEventListener);
        sinon.assert.notCalled(windowStub.dispatchEvent);
        sinon.assert.notCalled(windowStub.removeEventListener);
        sinon.assert.notCalled(windowStub.setInterval);
        sinon.assert.notCalled(windowStub.setTimeout);
        assert.ok(true);
      });
    });
  });

  module('#stopCheckingExtensionIsEnabled', function () {
    module('when Pix Companion is disabled', function () {
      test('do nothing', async function (assert) {
        // Given
        const windowStub = {
          clearInterval: sinon.stub(),
        };
        ENV.companion.disabled = true;

        // When
        pixCompanion.stopCheckingExtensionIsEnabled(windowStub);

        // Then
        sinon.assert.notCalled(windowStub.clearInterval);
        assert.ok(true);
      });
    });
  });

  module('#isExtensionEnabled', function () {
    module('when Pix Companion is disabled', function () {
      test('always returns true', function (assert) {
        // Given
        ENV.companion.disabled = true;

        // When
        pixCompanion._isExtensionEnabled = false;

        // Then
        assert.true(pixCompanion.isExtensionEnabled);
      });
    });
  });

  module('#hasMinimalVersionForCertification', function () {
    module('when extension is not detected', function () {
      test('returns false', function (assert) {
        // given
        pixCompanion._isExtensionEnabled = false;
        pixCompanion.version = '0.0.1';

        // then
        assert.false(pixCompanion.hasMinimalVersionForCertification);
      });
    });

    module('when extension is detected', function (hooks) {
      hooks.beforeEach(function () {
        pixCompanion._isExtensionEnabled = true;
      });

      module('when version is known and is 0.0.5 or greater', function () {
        test('returns true', function (assert) {
          // given
          pixCompanion.version = '0.0.10';

          // then
          assert.true(pixCompanion.hasMinimalVersionForCertification);
        });
      });

      module('when version is known and is lower than 0.0.5', function () {
        test('returns false', function (assert) {
          // given
          pixCompanion.version = '0.0.4';

          // then
          assert.false(pixCompanion.hasMinimalVersionForCertification);
        });
      });

      module('when version is unknown', function () {
        test('returns true', function (assert) {
          // given
          pixCompanion.version = undefined;

          // then
          assert.true(pixCompanion.hasMinimalVersionForCertification);
        });
      });
    });
  });
});
