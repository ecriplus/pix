import { Scopes } from '../../../../../../src/certification/shared/domain/models/Scopes.js';
import { NotFoundError } from '../../../../../../src/shared/domain/errors.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Certification | Shared | Domain | Models | Scopes', function () {
  describe('getByName', function () {
    it('should return the scope when it exists', function () {
      // Given
      const scopeName = 'CORE';

      // When
      const result = Scopes.getByName(scopeName);

      // Then
      expect(result).to.equal(Scopes.CORE);
    });

    it('should throw a NotFoundError when the scope does not exist', function () {
      // Given
      const scopeName = 'NON_EXISTENT';

      // When & Then
      expect(() => Scopes.getByName(scopeName)).to.throw(NotFoundError, 'Scope with name "NON_EXISTENT" not found.');
    });
  });

  it('should contain the supported Pix scopes', function () {
    expect(Scopes.CORE).to.equal('CORE');
    expect(Scopes.PIX_PLUS_DROIT).to.equal('DROIT');
    expect(Scopes.PIX_PLUS_EDU_1ER_DEGRE).to.equal('EDU_1ER_DEGRE');
    expect(Scopes.PIX_PLUS_EDU_2ND_DEGRE).to.equal('EDU_2ND_DEGRE');
    expect(Scopes.PIX_PLUS_EDU_CPE).to.equal('EDU_CPE');
    expect(Scopes.PIX_PLUS_PRO_SANTE).to.equal('PRO_SANTE');
  });
});
