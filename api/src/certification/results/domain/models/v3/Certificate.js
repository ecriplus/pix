/**
 * @typedef {import ('../../read-models/CertifiedBadge.js').CertifiedBadge} CertifiedBadge
 */
import { MAX_REACHABLE_SCORE } from '../../../../../shared/domain/constants.js';
import { CERTIFICATE_LEVELS } from '../../../../shared/domain/constants/mesh-configuration.js';
import { GlobalCertificationLevel } from './GlobalCertificationLevel.js';

export class Certificate {
  /**
   * @param {object} props
   * @param {number} props.id - certification course id
   * @param {string} props.firstName
   * @param {string} props.lastName
   * @param {Date} props.birthdate
   * @param {string} props.birthplace
   * @param {string} props.certificationCenter - center name
   * @param {string} props.pixScore
   * @param {GlobalCertificationLevel} props.[globalLevel] - auto calculated
   * @param {string} props.verificationCode
   * @param {Array<ResultCompetenceTree>} props.resultCompetenceTree
   * @param {AlgorithmEngineVersion} props.algorithmEngineVersion
   * @param {Date} props.certificationDate - date of certification
   * @param {CertifiedBadge} props.acquiredComplementaryCertification
   */
  constructor({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    certificationCenter,
    deliveredAt,
    pixScore,
    verificationCode,
    maxReachableLevelOnCertificationDate,
    resultCompetenceTree,
    algorithmEngineVersion,
    certificationDate,
    acquiredComplementaryCertification,
  } = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.birthplace = birthplace;
    this.deliveredAt = deliveredAt;
    this.certificationCenter = certificationCenter;
    this.pixScore = pixScore;
    this.globalLevel = this.#findLevel(pixScore, maxReachableLevelOnCertificationDate);
    this.verificationCode = verificationCode;
    this.maxReachableScore = MAX_REACHABLE_SCORE;
    this.resultCompetenceTree = this.globalLevel ? resultCompetenceTree : null;
    this.algorithmEngineVersion = algorithmEngineVersion;
    this.certificationDate = certificationDate;
    this.acquiredComplementaryCertification = acquiredComplementaryCertification;
  }

  #findLevel(pixScore, maxReachableLevelOnCertificationDate) {
    const globalCertificationLevel = new GlobalCertificationLevel({
      score: pixScore,
      maxReachableLevel: maxReachableLevelOnCertificationDate,
    });
    return globalCertificationLevel.meshLevel === CERTIFICATE_LEVELS.preBeginner ? null : globalCertificationLevel;
  }
}
