import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';
import { Element } from './Element.js';

class CustomElement extends Element {
  /**
   * @param{object} params
   * @param{string} params.id
   * @param{string} params.tagName
   * @param{string} params.props
   */
  constructor({ id, tagName, props }) {
    super({ id, type: 'custom' });
    assertNotNullOrUndefined(tagName, 'The tagName is required for a CustomElement element');
    assertNotNullOrUndefined(props, 'The props are required for a CustomElement element');
    this.tagName = tagName;
    this.props = props;
  }
}

export { CustomElement };
