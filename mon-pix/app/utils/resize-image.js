/**
 * Utility function to calculate new width and height for given image information.
 * You can pass a MAX_WIDTH or a MAX_HEIGHT option, and the function will do the maths.
 *
 * @param {Object} imageInformation - The object containing the image information to be resized.
 * @param {number} [imageInformation.width] - The current width of the image.
 * @param {number} [imageInformation.height] - The current height of the image.
 * @param {Object} [options] - The resizing options.
 * @param {number} [options.MAX_WIDTH] - The maximum desired width (in pixels).
 * @param {number} [options.MAX_HEIGHT] - The maximum desired height (in pixels).

 * @returns {Object|null} An object containing the new image dimensions with `width` and `height` properties (both numbers)
 * or `null` if the image information is invalid.
 */
export function resizeImage(imageInformation, options) {
  if (!imageInformation || !hasDimensions(imageInformation)) {
    return null;
  }

  if (!validateOptions(options)) {
    return imageInformation;
  }

  if (options.MAX_HEIGHT) return resizeByHeight(imageInformation, options.MAX_HEIGHT);

  return resizeByWidth(imageInformation, options.MAX_WIDTH);
}

export function resizeByHeight(imageInformation, MAX_HEIGHT) {
  const width = Math.round((MAX_HEIGHT * imageInformation.width) / imageInformation.height);
  const height = MAX_HEIGHT;
  return {
    width,
    height,
  };
}

export function resizeByWidth(imageInformation, MAX_WIDTH) {
  const height = Math.round((MAX_WIDTH * imageInformation.height) / imageInformation.width);
  const width = MAX_WIDTH;
  return {
    width,
    height,
  };
}

export function hasDimensions(imageInformation) {
  return imageInformation.width > 0 && imageInformation.height > 0;
}

export function validateOptions(options) {
  if (options === undefined) return false;

  const isDimensionsKeysProvided = Object.entries(options).some(([key, value]) => {
    return ['MAX_WIDTH', 'MAX_HEIGHT'].includes(key) && value;
  });
  if (!isDimensionsKeysProvided) return false;

  const { MAX_WIDTH, MAX_HEIGHT } = options;

  if (Number.isInteger(MAX_WIDTH) && MAX_WIDTH < 1) return false;
  if (Number.isInteger(MAX_HEIGHT) && MAX_HEIGHT < 1) return false;

  return true;
}
