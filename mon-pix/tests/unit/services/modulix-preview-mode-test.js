import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Service | modulix-preview-mode', function (hooks) {
  setupTest(hooks);

  test('it should be disabled by default', function (assert) {
    // when
    const previewMode = this.owner.lookup('service:modulix-preview-mode');

    // then
    assert.false(previewMode.isEnabled);
  });

  test('it enables preview mode', function (assert) {
    // given
    const previewMode = this.owner.lookup('service:modulix-preview-mode');

    // when
    previewMode.enable();

    // then
    assert.true(previewMode.isEnabled);
  });

  module('isElementsIdButtonEnabled', function () {
    test('it should be disabled by default', function (assert) {
      // when
      const previewMode = this.owner.lookup('service:modulix-preview-mode');

      // then
      assert.false(previewMode.isElementsIdButtonEnabled);
    });

    test('it enables elements id button', function (assert) {
      // given
      const previewMode = this.owner.lookup('service:modulix-preview-mode');

      // when
      previewMode.enableElementsIdButton();

      // then
      assert.true(previewMode.isElementsIdButtonEnabled);
    });

    module('get isPreviewAndElementsIdButtonEnabled', function () {
      module('when preview mode is not enabled', function () {
        test('it returns false', function (assert) {
          // given
          const previewMode = this.owner.lookup('service:modulix-preview-mode');

          // when
          previewMode.enableElementsIdButton();

          // then
          assert.false(previewMode.isPreviewAndElementsIdButtonEnabled);
        });
      });

      module('when elements id button is not enabled', function () {
        test('it returns false', function (assert) {
          // given
          const previewMode = this.owner.lookup('service:modulix-preview-mode');

          // when
          previewMode.enable();

          // then
          assert.false(previewMode.isPreviewAndElementsIdButtonEnabled);
        });
      });

      module('when both are enabled', function () {
        test('it returns true', function (assert) {
          // given
          const previewMode = this.owner.lookup('service:modulix-preview-mode');

          // when
          previewMode.enable();
          previewMode.enableElementsIdButton();

          // then
          assert.true(previewMode.isPreviewAndElementsIdButtonEnabled);
        });
      });
    });
  });
});
