import { Element } from './Element.js';
import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';

class Text extends Element {
  constructor({ id, content }) {
    super({ id, type: 'text' });

    assertNotNullOrUndefined(content, 'The content is required for a text');

    this.content = content;
  }
}

export { Text };
