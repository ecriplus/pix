import { getMeshLevel } from '../../../../../../src/certification/results/domain/services/pix-score-to-mesh-level.js';
import { domainBuilder, expect } from '../../../../../test-helper.js';

describe('Certification | Results | Unit | Domain | Service | pix-score-to-mesh-level', function () {
  it('should return a mesh level', function () {
    // given
    const v3CertificationScoring = domainBuilder.buildV3CertificationScoring();
    const pixScore = 520;
    const expectedResult = domainBuilder.certification.results.buildGlobalCertificationLevel({ meshLevel: 5 });

    // when
    const result = getMeshLevel({ pixScore, scoringConfiguration: v3CertificationScoring });

    // then
    expect(result).to.deep.equal(expectedResult);
  });
});
