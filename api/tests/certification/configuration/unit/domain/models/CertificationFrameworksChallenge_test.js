import { CertificationFrameworksChallenge } from '../../../../../../src/certification/configuration/domain/models/CertificationFrameworksChallenge.js';
import { ActiveCalibratedChallenge } from '../../../../../../src/certification/configuration/domain/read-models/ActiveCalibratedChallenge.js';
import { domainBuilder, expect } from '../../../../../test-helper.js';

describe('Certification | Configuration | Unit | Domain | Models | CertificationFrameworksChallenge', function () {
  describe('#calibrate', function () {
    it('updates discriminant and difficulty of a certificaitonFrameworksChallenge', function () {
      const complementaryCertification = domainBuilder.certification.shared.buildComplementaryCertification();
      const certificationFrameworksChallenge = new CertificationFrameworksChallenge({
        discriminant: null,
        difficulty: null,
        challengeId: 'rec123',
        complementaryCertificationKey: complementaryCertification.key,
      });

      const activeCalibratedChallenge = new ActiveCalibratedChallenge({
        challengeId: 'rec123',
        discriminant: 3.4,
        difficulty: 2.7,
        scope: complementaryCertification.key,
      });

      certificationFrameworksChallenge.calibrate(activeCalibratedChallenge);
      const { discriminant, difficulty } = certificationFrameworksChallenge;

      expect(discriminant).to.equal(activeCalibratedChallenge.discriminant);
      expect(difficulty).to.equal(activeCalibratedChallenge.difficulty);
    });
  });
});
