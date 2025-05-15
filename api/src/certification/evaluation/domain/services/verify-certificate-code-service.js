import _ from 'lodash';

import { config } from '../../../../shared/config.js';
import { CertificateVerificationCodeGenerationTooManyTrials } from '../../../../shared/domain/errors.js';
import * as certificationCourseRepository from '../../../shared/infrastructure/repositories/certification-course-repository.js';

const availableCharacters =
  `${config.availableCharacterForCode.numbers}${config.availableCharacterForCode.letters}`.split('');
const NB_CHAR = 8;
const NB_OF_TRIALS = 1000;

function _generateCode() {
  return 'P-' + _.times(NB_CHAR, _randomCharacter).join('').toUpperCase();
}

function _randomCharacter() {
  return _.sample(availableCharacters);
}

const generateCertificateVerificationCode = async function ({
  generateCode = _generateCode,
  dependencies = { certificationCourseRepository },
} = {}) {
  for (let i = 0; i < NB_OF_TRIALS; i++) {
    const verificationCode = generateCode();
    const isCodeAvailable = await dependencies.certificationCourseRepository.isVerificationCodeAvailable({
      verificationCode,
    });
    if (isCodeAvailable) return verificationCode;
  }
  throw new CertificateVerificationCodeGenerationTooManyTrials(NB_OF_TRIALS);
};

export { generateCertificateVerificationCode };
