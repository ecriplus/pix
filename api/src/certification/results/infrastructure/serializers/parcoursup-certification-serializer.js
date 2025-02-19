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
  return {
    organizationUai: certificationResult.organizationUai,
    ine: certificationResult.ine,
    firstName: certificationResult.firstName,
    lastName: certificationResult.lastName,
    birthdate: certificationResult.birthdate,
    status: certificationResult.status,
    pixScore: certificationResult.pixScore,
    globalLevel: globalMeshLevel.getLevelLabel(translate),
    certificationDate: certificationResult.certificationDate,
    competences: certificationResult.competences,
  };
};

export { serialize };
