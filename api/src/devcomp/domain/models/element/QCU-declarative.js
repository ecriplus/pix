import { QCU } from './QCU.js';

class QCUDeclarative extends QCU {
  constructor({ id, instruction, proposals }) {
    super({ id, instruction, proposals, type: 'qcu-declarative' });
  }
}

export { QCUDeclarative };
