import jsonwebtoken from 'jsonwebtoken';

import { config } from '../../../shared/config.js';
import { cryptoService } from '../../../shared/domain/services/crypto-service.js';

const generateTemporaryKey = async function () {
  const randomBytesBuffer = await cryptoService.randomBytes(16);
  const base64RandomBytes = randomBytesBuffer.toString('base64');
  return jsonwebtoken.sign(
    {
      data: base64RandomBytes,
    },
    config.temporaryKey.secret,
    { expiresIn: config.temporaryKey.tokenLifespan },
  );
};

const invalidateOldResetPasswordDemand = function (userEmail, resetPasswordDemandRepository) {
  return resetPasswordDemandRepository.markAsBeingUsed(userEmail);
};

const verifyDemand = function (temporaryKey, resetPasswordDemandRepository) {
  return resetPasswordDemandRepository.findByTemporaryKey(temporaryKey);
};

/**
 * @callback assertUserHasPasswordResetDemandInProgress
 * @param {string} email
 * @param {string} temporaryKey
 * @param {ResetPasswordDemandRepository} resetPasswordDemandRepository
 * @return {Promise<*>}
 */
const assertUserHasPasswordResetDemandInProgress = function (email, temporaryKey, resetPasswordDemandRepository) {
  return resetPasswordDemandRepository.getByUserEmail(email, temporaryKey);
};

/**
 * @typedef {Object} ResetPasswordService
 * @property generateTemporaryKey
 * @property assertUserHasPasswordResetDemandInProgress
 * @property invalidateOldResetPasswordDemand
 * @property verifyDemand
 */
const resetPasswordService = {
  generateTemporaryKey,
  assertUserHasPasswordResetDemandInProgress,
  invalidateOldResetPasswordDemand,
  verifyDemand,
};
export { resetPasswordService };
