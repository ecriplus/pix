import { QCUDiscovery } from '../../../../../../src/devcomp/domain/models/element/QCU-discovery.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Devcomp | Domain | Models | Element | QCU-discovery', function () {
  describe('#constructor', function () {
    it('should instanciate a QCU-discovery with right properties', function () {
      // Given
      const proposal1 = Symbol('proposal1');
      const proposal2 = Symbol('proposal2');

      // When
      const qcu = new QCUDiscovery({
        id: '123',
        instruction: 'instruction',
        proposals: [proposal1, proposal2],
        solution: '1',
      });

      // Then
      expect(qcu.id).equal('123');
      expect(qcu.instruction).equal('instruction');
      expect(qcu.type).equal('qcu-discovery');
      expect(qcu.proposals).deep.equal([proposal1, proposal2]);
      expect(qcu.solution).equal('1');
    });
  });
});
