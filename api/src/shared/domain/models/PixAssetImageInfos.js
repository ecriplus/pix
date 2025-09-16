export class PixAssetImageInfos {
  static #SUPPORTED_RASTER_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  static #SUPPORTED_VECTOR_TYPES = ['image/svg+xml'];

  /**
   * @param{object} params
   * @param{number} [params.width]
   * @param{number} [params.height]
   * @param{string} [params.contentType]
   */
  constructor({ width, height, contentType }) {
    if (width) {
      this.width = width;
    }

    if (height) {
      this.height = height;
    }

    if (PixAssetImageInfos.#SUPPORTED_RASTER_TYPES.includes(contentType)) {
      this.type = 'raster';
      return;
    }

    if (PixAssetImageInfos.#SUPPORTED_VECTOR_TYPES.includes(contentType)) {
      this.type = 'vector';
      return;
    }
  }
}
