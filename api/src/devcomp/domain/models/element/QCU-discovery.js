import { QCU } from './QCU.js';

class QCUDiscovery extends QCU {
  constructor({ id, instruction, proposals, solution }) {
    super({ id, instruction, proposals, type: 'qcu-discovery' });

    this.solution = solution;
  }
}

export { QCUDiscovery };
