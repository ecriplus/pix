import { DomainError } from '../../../../shared/domain/errors.js';
import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';
import { Element } from './Element.js';

class CustomDraft extends Element {
  static #VALID_URL_PREFIX = 'https://1024pix.github.io/atelier-contenus';

  constructor({ id, title, url, instruction, height }) {
    super({ id, type: 'custom-draft' });

    assertNotNullOrUndefined(title, 'The title is required for a custom-draft');
    assertNotNullOrUndefined(url, 'The URL is required for a custom-draft');
    if (!URL.canParse(url)) {
      throw new DomainError('The URL must be a valid URL for a custom-draft');
    }

    assertNotNullOrUndefined(height, 'The height is required for an embed');

    this.title = title;
    this.url = url;
    this.instruction = instruction;
    this.height = height;

    if (!URL.parse(url).href.startsWith(CustomDraft.#VALID_URL_PREFIX)) {
      throw new DomainError('The custom-draft URL must be from "1024pix.github.io/atelier-contenus"');
    }
  }
}

export { CustomDraft };
