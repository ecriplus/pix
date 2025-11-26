import { resizeImage } from 'mon-pix/utils/resize-image';
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

    module('when provided image is raster', function () {
      test('should return current height when MAX_HEIGHT option is provided', function (assert) {
        // given
        const imageInformation = { height: 50, width: 100, type: 'raster' };
        const options = {
          MAX_HEIGHT: 100,
        };

        // when
        const dimensions = resizeImage(imageInformation, options);

        //then
        assert.deepEqual(dimensions, { height: 50, width: 100 });
      });
      test('should return current width if MAX_WIDTH option is provided and larger than width', function (assert) {
        // given
        const imageInformation = { height: 100, width: 50, type: 'raster' };
        const options = {
          MAX_WIDTH: 100,
        };

        // when
        const dimensions = resizeImage(imageInformation, options);

        //then
        assert.deepEqual(dimensions, { height: 100, width: 50 });
      });
    });

    module('when provided image is vector', function () {
      test('should return accurate result when MAX_HEIGHT option is provided', function (assert) {
        // given
        const imageInformation = { height: 50, width: 100, type: 'vector' };
        const options = {
          MAX_HEIGHT: 100,
        };

        // when
        const dimensions = resizeImage(imageInformation, options);

        //then
        assert.deepEqual(dimensions, { height: 100, width: 200 });
      });

      test('should return accurate result if MAX_WIDTH option is provided and larger than width', function (assert) {
        // given
        const imageInformation = { height: 100, width: 50, type: 'vector' };
        const options = {
          MAX_WIDTH: 100,
        };

        // when
        const dimensions = resizeImage(imageInformation, options);

        //then
        assert.deepEqual(dimensions, { height: 200, width: 100 });
      });
    });

    test('should return MAX_WIDTH if MAX_WIDTH option is provided and smaller than width', function (assert) {
      // given
      const imageInformation = { height: 100, width: 500 };
      const options = {
        MAX_WIDTH: 100,
      };

      // when
      const dimensions = resizeImage(imageInformation, options);

      //then
      assert.deepEqual(dimensions, { height: 20, width: 100 });
    });
  });
});
