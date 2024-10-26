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

const invalidateOldResetPasswordDemandsByEmail = function (userEmail, resetPasswordDemandRepository) {
  return resetPasswordDemandRepository.markAllAsUsedByEmail(userEmail);
};

const verifyDemand = function (temporaryKey, resetPasswordDemandRepository) {
  return resetPasswordDemandRepository.findByTemporaryKey(temporaryKey);
};

/**
 * @param {string} email
 * @param {string} temporaryKey
 * @param {ResetPasswordDemandRepository} resetPasswordDemandRepository
 * @return {Promise<*>}
 * @throws PasswordResetDemandNotFoundError
 */
const invalidateResetPasswordDemand = function (email, temporaryKey, resetPasswordDemandRepository) {
  return resetPasswordDemandRepository.markAsUsed(email, temporaryKey);
};

/**
 * @typedef {Object} ResetPasswordService
 * @property generateTemporaryKey
 * @property invalidateResetPasswordDemand
 * @property invalidateOldResetPasswordDemandsByEmail
 * @property verifyDemand
 */
const resetPasswordService = {
  generateTemporaryKey,
  invalidateResetPasswordDemand,
  invalidateOldResetPasswordDemandsByEmail,
  verifyDemand,
};
export { resetPasswordService };
