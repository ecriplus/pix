import { Certificate } from '../../../../../../src/certification/results/domain/models/v3/Certificate.js';
import { AlgorithmEngineVersion } from '../../../../../../src/certification/shared/domain/models/AlgorithmEngineVersion.js';
import { Frameworks } from '../../../../../../src/certification/shared/domain/models/Frameworks.js';

const buildCertificate = function ({
  id = 1,
  firstName = 'Jean',
  lastName = 'Bon',
  birthdate = '1992-06-12',
  birthplace = 'Paris',
  certificationCenter = 'L’université du Pix',
  deliveredAt = new Date('2018-10-03T01:02:03Z'),
  pixScore = 123,
  reachedMeshIndex = 1,
  verificationCode = 'P-SOMECODE',
  resultCompetenceTree = null,
  algorithmEngineVersion = AlgorithmEngineVersion.V3,
  certificationDate = new Date('2015-10-03T01:02:03Z'),
  acquiredComplementaryCertification = null,
  certificationFramework = Frameworks.CORE,
  eduV3ExternalJuryResult = null,
} = {}) {
  return new Certificate({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    certificationCenter,
    deliveredAt,
    pixScore,
    reachedMeshIndex,
    verificationCode,
    resultCompetenceTree,
    algorithmEngineVersion,
    certificationDate,
    acquiredComplementaryCertification,
    certificationFramework,
    eduV3ExternalJuryResult,
  });
};

export { buildCertificate };
