import { assertEnumValue, assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';
import { Element } from './Element.js';

const TextTagEnumValues = Object.freeze({
  NONE: ' ',
  CONTEXT: 'context',
  DID_YOU_KNOW: 'did-you-know',
  FURTHER_INFORMATION: 'further-information',
  KEY_POINTS: 'key-points',
  TIP: 'tip',
});

class Text extends Element {
  constructor({ id, content, tag }) {
    super({ id, type: 'text', tag: ' ' });

    assertNotNullOrUndefined(content, 'The content is required for a text');
    assertEnumValue(
      TextTagEnumValues,
      tag,
      "The tag value must be one of: ' ', 'context', 'did-you-know', 'further-information', 'key-points', 'tip'",
    );

    this.content = content;
    this.tag = tag;
  }
}

export { Text };
