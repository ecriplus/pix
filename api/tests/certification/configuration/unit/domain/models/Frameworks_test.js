import { Frameworks } from '../../../../../../src/certification/configuration/domain/models/Frameworks.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Certification | Configuration | Domain | Models | Frameworks', function () {
  it('should contain all supported certification frameworks', function () {
    expect(Frameworks.CORE).to.equal('CORE');
    expect(Frameworks.DROIT).to.equal('DROIT');
    expect(Frameworks.EDU_1ER_DEGRE).to.equal('EDU_1ER_DEGRE');
    expect(Frameworks.EDU_2ND_DEGRE).to.equal('EDU_2ND_DEGRE');
    expect(Frameworks.EDU_CPE).to.equal('EDU_CPE');
    expect(Frameworks.PRO_SANTE).to.equal('PRO_SANTE');
    expect(Frameworks.CLEA).to.equal('CLEA');

    const frameworkValues = Object.values(Frameworks);
    expect(frameworkValues).to.have.lengthOf(7);
  });
});
