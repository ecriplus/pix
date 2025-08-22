import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';
import { ModuleInstantiationError } from '../../errors.js';
import { Element } from './Element.js';

class QCUDeclarative extends Element {
  constructor({ id, instruction, proposals }) {
    super({ id, type: 'qcu-declarative' });

    assertNotNullOrUndefined(instruction, 'The instruction is required for a QCU declarative');
    this.#assertProposalsIsAnArray(proposals);
    this.#assertProposalsAreNotEmpty(proposals);

    this.instruction = instruction;
    this.proposals = proposals;
    this.isAnswerable = true;
  }

  #assertProposalsAreNotEmpty(proposals) {
    if (proposals.length === 0) {
      throw new ModuleInstantiationError('The proposals are required for a QCU declarative');
    }
  }

  #assertProposalsIsAnArray(proposals) {
    if (!Array.isArray(proposals)) {
      throw new ModuleInstantiationError('The QCU declarative proposals should be a list');
    }
  }
}

export { QCUDeclarative };
