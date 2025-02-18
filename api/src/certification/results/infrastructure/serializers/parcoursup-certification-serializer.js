/**
 * @typedef {import('../../domain/read-models/parcoursup/CertificationResult.js').CertificationResult} CertificationResult
 * @typedef {import('../../../shared/domain/models/GlobalCertificationLevel.js').GlobalCertificationLevel} GlobalCertificationLevel
 */

/**
 * @param {Object} params
 * @param {CertificationResult} params.certificationResult
 * @param {GlobalCertificationLevel} params.globalMeshLevel
 * @param {Object} params.translate
 */
const serialize = ({ certificationResult, globalMeshLevel, translate }) => {
  // TODO: tests
  return {
    ine: certificationResult.ine,
    organizationUai: certificationResult.organizationUai,
    lastName: certificationResult.lastName,
    firstName: certificationResult.firstName,
    birthdate: certificationResult.birthdate,
    status: certificationResult.status,
    pixScore: certificationResult.pixScore,
    certificationDate: certificationResult.certificationDate,
    competences: certificationResult.competences,
    globalLevel: globalMeshLevel.getLevelLabel(translate),
  };
};

export { serialize };
