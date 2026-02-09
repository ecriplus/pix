import { QCU } from './QCU.js';

class QCUDiscovery extends QCU {
  constructor({ id, instruction, proposals, solution, hasShortProposals = false } = {}) {
    super({ id, instruction, proposals, solution, type: 'qcu-discovery' });

    this.hasShortProposals = Boolean(hasShortProposals);
    this.solution = solution;
  }
}

export { QCUDiscovery };
