import { Frameworks } from '../../../../../../src/certification/shared/domain/models/Frameworks.js';
import { NotFoundError } from '../../../../../../src/shared/domain/errors.js';
import { expect } from '../../../../../test-helper.js';

describe('Frameworks', function () {
  describe('findByName', function () {
    it('should return the framework when it exists', function () {
      // Given
      const frameworkName = 'CORE';

      // When
      const result = Frameworks.findByName(frameworkName);

      // Then
      expect(result).to.equal(Frameworks.CORE);
    });

    it('should throw a NotFoundError when the framework does not exist', function () {
      // Given
      const frameworkName = 'NON_EXISTENT';

      // When & Then
      expect(() => Frameworks.findByName(frameworkName)).to.throw(
        NotFoundError,
        'Framework with name "NON_EXISTENT" not found.',
      );
    });
  });

  it('should contain all framework enums', function () {
    expect(Frameworks.CORE).to.equal('CORE');
    expect(Frameworks.PIX_PLUS_DROIT).to.equal('DROIT');
    expect(Frameworks.PIX_PLUS_EDU_1ER_DEGRE).to.equal('EDU_1ER_DEGRE');
    expect(Frameworks.PIX_PLUS_EDU_2ND_DEGRE).to.equal('EDU_2ND_DEGRE');
    expect(Frameworks.PIX_PLUS_EDU_CPE).to.equal('EDU_CPE');
    expect(Frameworks.PIX_PLUS_PRO_SANTE).to.equal('PRO_SANTE');
  });
});
