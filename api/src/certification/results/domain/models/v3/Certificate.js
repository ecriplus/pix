import { MAX_REACHABLE_SCORE } from '../../../../../shared/domain/constants.js';
import { GlobalCertificationLevel } from './GlobalCertificationLevel.js';

export class V3Certificate {
  /**
   * @param {Object} props
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
    resultCompetenceTree,
    algorithmEngineVersion,
    certificationDate,
  } = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.birthplace = birthplace;
    this.deliveredAt = deliveredAt;
    this.certificationCenter = certificationCenter;
    this.pixScore = pixScore;
    this.globalLevel = this.isPreBeginnerLevel ? null : new GlobalCertificationLevel({ score: pixScore });
    this.verificationCode = verificationCode;
    this.maxReachableScore = MAX_REACHABLE_SCORE;
    this.resultCompetenceTree = this.isPreBeginnerLevel ? null : resultCompetenceTree;
    this.algorithmEngineVersion = algorithmEngineVersion;
    this.certificationDate = certificationDate;
  }

  get isPreBeginnerLevel() {
    return new GlobalCertificationLevel({ score: this.pixScore }).meshLevel === 'LEVEL_PRE_BEGINNER';
  }
}
