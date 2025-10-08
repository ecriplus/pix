import { resizeByHeight, resizeByWidth, resizeImage, validateOptions } from 'mon-pix/utils/resize-image';
import { module, test } from 'qunit';

module('Unit | Utility | Resize Image', function () {
  module('#resizeImage', function () {
    test('should return null if there is no information', function (assert) {
      // given
      const imageInformation = null;

      // when
      const dimensions = resizeImage(imageInformation, { MAX_HEIGHT: 100 });

      // then
      assert.deepEqual(dimensions, null);
    });

    test('should return null if image height is equal to 0', function (assert) {
      // given
      const imageInformation = { height: 0 };

      // when
      const dimensions = resizeImage(imageInformation, { MAX_HEIGHT: 100 });

      // then
      assert.deepEqual(dimensions, null);
    });

    test('should return null if image width is equal to 0', function (assert) {
      // given
      const imageInformation = { width: 0 };

      // when
      const dimensions = resizeImage(imageInformation, { MAX_HEIGHT: 100 });

      // then
      assert.deepEqual(dimensions, null);
    });

    test('should return unchanged width and height when no option is provided', function (assert) {
      // given
      const imageInformation = { height: 50, width: 50 };

      // when
      const dimensions = resizeImage(imageInformation);

      //then
      assert.deepEqual(imageInformation, dimensions);
    });

    test('should return accurate result when MAX_HEIGHT option is provided', function (assert) {
      // given
      const imageInformation = { height: 50, width: 100 };
      const options = {
        MAX_HEIGHT: 100,
      };

      // when
      const dimensions = resizeImage(imageInformation, options);

      //then
      assert.deepEqual(dimensions, { height: 100, width: 200 });
    });

    test('should return accurate result when MAX_WIDTH option is provided', function (assert) {
      // given
      const imageInformation = { height: 100, width: 50 };
      const options = {
        MAX_WIDTH: 100,
      };

      // when
      const dimensions = resizeImage(imageInformation, options);

      //then
      assert.deepEqual(dimensions, { height: 200, width: 100 });
    });
  });

  module('#resizeByHeight', function () {
    test('should return the accurate result for a resize by height', function (assert) {
      // given
      const imageInformation = { width: 100, height: 50 };
      const MAX_HEIGHT = 100;
      // when
      const dimensions = resizeByHeight(imageInformation, MAX_HEIGHT);

      // then
      assert.deepEqual(dimensions, { width: 200, height: 100 });
    });
  });

  module('#resizeByWidth', function () {
    test('should return the accurate result for a resize by width', function (assert) {
      // given
      const imageInformation = { width: 50, height: 100 };
      const MAX_WIDTH = 100;
      // when
      const dimensions = resizeByWidth(imageInformation, MAX_WIDTH);

      // then
      assert.deepEqual(dimensions, { width: 100, height: 200 });
    });
  });

  module('#validateOptions', function () {
    test('should return false if options is undefined', function (assert) {
      // given
      const options = undefined;

      // when
      const validationStatus = validateOptions(options);

      // then
      assert.false(validationStatus);
    });
    test('should return false if options has neither MAX_WIDTH nor MAX_HEIGHT', function (assert) {
      // given
      const options = {};
      // when
      const validationStatus = validateOptions(options);

      // then
      assert.false(validationStatus);
    });
    test('should return true if options contains MAX_WIDTH', function (assert) {
      // given
      const options = { MAX_WIDTH: 20 };
      // when
      const validationStatus = validateOptions(options);

      // then
      assert.true(validationStatus);
    });
    test('should return true if options contains MAX_HEIGHT', function (assert) {
      // given
      const options = { MAX_HEIGHT: 20 };
      // when
      const validationStatus = validateOptions(options);

      // then
      assert.true(validationStatus);
    });

    test('should return false if provided MAX_WIDTH equals 0', function (assert) {
      // given
      const options = { MAX_WIDTH: 0 };
      // when
      const validationStatus = validateOptions(options);

      // then
      assert.false(validationStatus);
    });

    test('should return false if provided MAX_HEIGHT equals 0', function (assert) {
      // given
      const options = { MAX_HEIGHT: 0 };
      // when
      const validationStatus = validateOptions(options);

      // then
      assert.false(validationStatus);
    });
  });
});
