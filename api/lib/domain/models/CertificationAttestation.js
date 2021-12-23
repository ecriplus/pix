const {
  PIX_EMPLOI_CLEA,
  PIX_EMPLOI_CLEA_V2,
  PIX_DROIT_MAITRE_CERTIF,
  PIX_DROIT_EXPERT_CERTIF,
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_AUTONOME,
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_AVANCE,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_FORMATEUR,
} = require('./Badge').keys;

const PIX_COUNT_BY_LEVEL = 8;
const COMPETENCE_COUNT = 16;

class CertificationAttestation {
  constructor({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    isPublished,
    userId,
    date,
    deliveredAt,
    certificationCenter,
    pixScore,
    acquiredPartnerCertificationKeys,
    resultCompetenceTree = null,
    verificationCode,
    maxReachableLevelOnCertificationDate,
  } = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.birthplace = birthplace;
    this.isPublished = isPublished;
    this.userId = userId;
    this.date = date;
    this.deliveredAt = deliveredAt;
    this.certificationCenter = certificationCenter;
    this.pixScore = pixScore;
    this.acquiredPartnerCertificationKeys = acquiredPartnerCertificationKeys;
    this.resultCompetenceTree = resultCompetenceTree;
    this.verificationCode = verificationCode;
    this.maxReachableLevelOnCertificationDate = maxReachableLevelOnCertificationDate;
    this.maxReachableScore = this.maxReachableLevelOnCertificationDate * PIX_COUNT_BY_LEVEL * COMPETENCE_COUNT;
  }

  setResultCompetenceTree(resultCompetenceTree) {
    this.resultCompetenceTree = resultCompetenceTree;
  }

  getAcquiredCleaCertification() {
    return this.acquiredPartnerCertificationKeys.find((key) => key === PIX_EMPLOI_CLEA || key === PIX_EMPLOI_CLEA_V2);
  }

  getAcquiredPixPlusDroitCertification() {
    return this.acquiredPartnerCertificationKeys.find(
      (key) => key === PIX_DROIT_MAITRE_CERTIF || key === PIX_DROIT_EXPERT_CERTIF
    );
  }

  getAcquiredPixPlusEduCertification() {
    return this.acquiredPartnerCertificationKeys.find(
      (key) =>
        key === PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_AUTONOME ||
        key === PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_AVANCE ||
        key === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE ||
        key === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT ||
        key === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_FORMATEUR
    );
  }

  hasAcquiredAnyComplementaryCertifications() {
    return this.acquiredPartnerCertificationKeys.length > 0;
  }
}

module.exports = CertificationAttestation;
