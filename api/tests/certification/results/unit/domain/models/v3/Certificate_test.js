import { Certificate } from '../../../../../../../src/certification/results/domain/models/v3/Certificate.js';
import { GlobalCertificationLevel } from '../../../../../../../src/certification/results/domain/models/v3/GlobalCertificationLevel.js';
import { expect } from '../../../../../../test-helper.js';

describe('Unit | Domain | Models | Certification | Results | Certificate v3', function () {
  describe('when the level is pre-beginner', function () {
    it('should return the model with an empty competence tree array and a null global level', function () {
      // given & when
      const certificate = new Certificate({
        id: 1,
        firstName: 'Jean',
        lastName: 'Bon',
        birthdate: '1992-06-12',
        birthplace: 'Paris',
        certificationCenter: 'L’université du Pix',
        deliveredAt: new Date('2025-10-30T01:02:03Z'),
        pixScore: 63,
        verificationCode: 'P-SOMECODE',
        maxReachableLevelOnCertificationDate: 7,
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
      const certificate = new Certificate({
        id: 1,
        firstName: 'Jean',
        lastName: 'Bon',
        birthdate: '1992-06-12',
        birthplace: 'Paris',
        certificationCenter: 'L’université du Pix',
        deliveredAt: new Date('2025-10-30T01:02:03Z'),
        pixScore: 65,
        verificationCode: 'P-SOMECODE',
        maxReachableLevelOnCertificationDate: 7,
        resultCompetenceTree: [Symbol('competence')],
      });
      // then
      expect(certificate.resultCompetenceTree).to.be.instanceOf(Array).and.to.not.be.empty;
      expect(certificate.globalLevel).to.be.instanceOf(GlobalCertificationLevel);
    });
  });
});
