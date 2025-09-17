import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';
import { Element } from './Element.js';

class CustomElement extends Element {
  /**
   * @param{object} params
   * @param{string} params.id
   * @param{string} params.instruction
   * @param{string} params.tagName
   * @param{string} params.props
   */
  constructor({ id, instruction, tagName, props }) {
    super({ id, type: 'custom' });

    assertNotNullOrUndefined(instruction, 'The instruction is required for a CustomElement element');
    assertNotNullOrUndefined(tagName, 'The tagName is required for a CustomElement element');
    assertNotNullOrUndefined(props, 'The props are required for a CustomElement element');

    this.instruction = instruction;
    this.tagName = tagName;
    this.props = props;
  }
}

export { CustomElement };
