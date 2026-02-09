/**
 * @typedef {import('../../../../shared/domain/models/ComplementaryCertification.js').ComplementaryCertification} ComplementaryCertification
 * @typedef {import('../../../domain/read-models/EnrolledCandidate.js').EnrolledCandidate} EnrolledCandidate
 * @typedef {import('i18n')} i18n
 */
import dayjs from 'dayjs';

import { CertificationCandidate } from '../../../shared/domain/models/CertificationCandidate.js';
import { ComplementaryCertificationKeys } from '../../../shared/domain/models/ComplementaryCertificationKeys.js';

const FRANCE_COUNTRY_CODE = '99100';

export class CandidateData {
  /**
   * @param {object} params
   * @param {ComplementaryCertification|null} params.complementaryCertification
   */
  constructor({
    id = null,
    firstName = null,
    lastName = null,
    sex = null,
    birthPostalCode = null,
    birthINSEECode = null,
    birthCity = null,
    birthProvinceCode = null,
    birthCountry = null,
    email = null,
    resultRecipientEmail = null,
    externalId = null,
    birthdate = null,
    extraTimePercentage = null,
    createdAt = null,
    sessionId = null,
    userId = null,
    organizationLearnerId = null,
    number = null,
    complementaryCertification = null,
    billingMode = null,
    prepaymentCode = null,
    i18n = null,
  }) {
    this.translate = i18n.__;
    this.id = id || '';
    this.firstName = firstName || '';
    this.lastName = lastName || '';
    this.sex = sex || '';
    this.birthProvinceCode = birthProvinceCode || '';
    this.birthCountry = birthCountry || '';
    this.email = email || '';
    this.resultRecipientEmail = resultRecipientEmail || '';
    this.externalId = externalId || '';
    this.birthdate = birthdate === null ? '' : dayjs(birthdate, 'YYYY-MM-DD').format('YYYY-MM-DD');
    this.#setExtraTimePercentage(extraTimePercentage);
    this.createdAt = createdAt || '';
    this.sessionId = sessionId || '';
    this.userId = userId || '';
    this.organizationLearnerId = organizationLearnerId || '';
    this.billingMode = CertificationCandidate.translateBillingMode({ billingMode, translate: this.translate });
    this.prepaymentCode = prepaymentCode || '';
    this.#setBirthCityAndPostalCode(birthCity, birthCountry, birthINSEECode, birthPostalCode);
    this.#setupKindOfCertificationAttributes(complementaryCertification);
    this.count = number;
    this.#setBirthINSEECode(birthINSEECode, birthCountry);
  }

  #setupKindOfCertificationAttributes(complementaryCertification) {
    const key = complementaryCertification?.key;
    const yes = this.translate('candidate-list-template.yes');
    this.cleaNumerique = key === ComplementaryCertificationKeys.CLEA ? yes : '';
    this.pixPlusDroit = key === ComplementaryCertificationKeys.PIX_PLUS_DROIT ? yes : '';
    this.pixPlusEdu1erDegre = key === ComplementaryCertificationKeys.PIX_PLUS_EDU_1ER_DEGRE ? yes : '';
    this.pixPlusEdu2ndDegre = key === ComplementaryCertificationKeys.PIX_PLUS_EDU_2ND_DEGRE ? yes : '';
    this.pixPlusProSante = key === ComplementaryCertificationKeys.PIX_PLUS_PRO_SANTE ? yes : '';
    this.pixPlusEduCPE = key === ComplementaryCertificationKeys.PIX_PLUS_EDU_CPE ? yes : '';
  }

  #setBirthCityAndPostalCode(birthCity, birthCountry, birthINSEECode, birthPostalCode) {
    this.birthCity = birthCountry?.toUpperCase() === 'FRANCE' && birthINSEECode ? '' : birthCity;
    this.birthPostalCode = birthCountry?.toUpperCase() === 'FRANCE' && birthINSEECode ? '' : birthPostalCode;
  }

  #setBirthINSEECode(birthINSEECode, birthCountry) {
    if (birthCountry != 'FRANCE' && birthINSEECode && birthINSEECode !== FRANCE_COUNTRY_CODE) {
      this.birthINSEECode = '99';
    } else {
      this.birthINSEECode = birthINSEECode;
    }
  }

  #setExtraTimePercentage(extraTimePercentage) {
    if (Number.isFinite(extraTimePercentage) && extraTimePercentage > 0) {
      this.extraTimePercentage = extraTimePercentage;
    } else {
      this.extraTimePercentage = '';
    }
  }

  /**
   * @param {object} params
   * @param {EnrolledCandidate} params.enrolledCandidate
   * @param {Array<Habilitation>} params.certificationCenterHabilitations
   * @param {number} params.number
   * @param {i18n} params.i18n
   */
  static fromEnrolledCandidateAndCandidateNumber({
    enrolledCandidate,
    certificationCenterHabilitations = [],
    number,
    i18n,
  }) {
    const candidateComplementarySubscription = enrolledCandidate.findComplementarySubscriptionInfo();
    if (!candidateComplementarySubscription) {
      return new CandidateData({
        ...enrolledCandidate,
        complementaryCertification: null,
        number,
        i18n,
      });
    }

    const complementaryCertification =
      certificationCenterHabilitations.find(
        ({ key }) => key === candidateComplementarySubscription.complementaryCertificationKey,
      ) || null;

    return new CandidateData({
      ...enrolledCandidate,
      complementaryCertification,
      number,
      i18n,
    });
  }

  static empty({ number, i18n }) {
    return new CandidateData({ number, i18n });
  }
}
