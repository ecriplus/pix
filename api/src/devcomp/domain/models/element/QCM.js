import { assertIsArray, assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';
import { ModuleInstantiationError } from '../../errors.js';
import { Feedbacks } from '../Feedbacks.js';
import { Element } from './Element.js';

class QCM extends Element {
  constructor({ id, instruction, locales, proposals, feedbacks }) {
    super({ id, type: 'qcm' });

    assertNotNullOrUndefined(instruction, 'The instruction is required for a QCM');
    assertIsArray(proposals, 'The proposals should be in a list');
    this.#assertProposalsAreNotEmpty(proposals);

    this.instruction = instruction;
    this.locales = locales;
    this.proposals = proposals;
    this.isAnswerable = true;

    if (feedbacks) {
      this.feedbacks = new Feedbacks(feedbacks);
    }
  }

  #assertProposalsAreNotEmpty(proposals) {
    if (proposals.length === 0) {
      throw new ModuleInstantiationError('The proposals are required for a QCM');
    }
  }
}

export { QCM };
