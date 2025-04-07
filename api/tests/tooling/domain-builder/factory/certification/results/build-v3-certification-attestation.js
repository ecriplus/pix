import { V3CertificationAttestation } from '../../../../../../src/certification/results/domain/models/V3CertificationAttestation.js';

const buildV3CertificationAttestation = function ({
  id = 1,
  firstName = 'Jean',
  lastName = 'Bon',
  birthdate = '1992-06-12',
  birthplace = 'Paris',
  certificationCenter = 'L’université du Pix',
  deliveredAt = new Date('2018-10-03T01:02:03Z'),
  pixScore = 123,
  verificationCode = 'P-SOMECODE',
} = {}) {
  return new V3CertificationAttestation({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    certificationCenter,
    deliveredAt,
    pixScore,
    verificationCode,
  });
};

export { buildV3CertificationAttestation };
