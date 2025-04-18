import { GlobalCertificationLevel } from '../../../../../../../src/certification/results/domain/models/v3/GlobalCertificationLevel.js';
import { domainBuilder, expect } from '../../../../../../test-helper.js';

describe('Unit | Domain | Models | Certification | Results | Certificate v3', function () {
  describe('when the level is pre-beginner', function () {
    it('should return the model with an empty competence tree array and a null global level', function () {
      // given & when
      const certificate = domainBuilder.certification.results.buildV3CertificationAttestation({
        pixScore: 63,
        resultCompetenceTree: [Symbol('competence')],
      });

      // then
      expect(certificate.resultCompetenceTree).to.be.null;
      expect(certificate.globalLevel).to.be.null;
    });
  });

  describe('when the level is not pre-beginner', function () {
    it('should return the model with filled competence tree array and a global level object', function () {
      // given & when
      const certificate = domainBuilder.certification.results.buildV3CertificationAttestation({
        pixScore: 65,
        resultCompetenceTree: [Symbol('competence')],
      });

      // then
      expect(certificate.resultCompetenceTree).to.be.instanceOf(Array).and.to.not.be.empty;
      expect(certificate.globalLevel).to.be.instanceOf(GlobalCertificationLevel);
    });
  });
});
