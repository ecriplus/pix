import jsonwebtoken from 'jsonwebtoken';

import { config } from '../../../../src/shared/config.js';
import { InvalidResultRecipientTokenError } from '../errors.js';

const CERTIFICATION_RESULTS_BY_RECIPIENT_EMAIL_LINK_SCOPE = 'certificationResultsByRecipientEmailLink';

/**
 * Encode and sign a payload into a JWT token (using jsonwebtoken library)
 * @param {Record<string, any>} payload Token payload
 * @param {string} secret Secret for the signature
 * @param {Record<string, any>} options Sign options (ex: { expiresIn })
 * @returns The encoded and signed token
 */
function encodeToken(payload, secret, options) {
  return jsonwebtoken.sign(payload, secret, options);
}

/**
 * Decode a token with the given secret
 * @param {string} token
 * @param {string} secret Secret for the signature
 * @returns The decoded token, otherwise false when cannot be decoded
 */
function getDecodedToken(token, secret = config.authentication.secret) {
  try {
    return jsonwebtoken.verify(token, secret);
  } catch {
    return false;
  }
}

function createCertificationResultsByRecipientEmailLinkToken({
  sessionId,
  resultRecipientEmail,
  daysBeforeExpiration,
}) {
  return jsonwebtoken.sign(
    {
      session_id: sessionId,
      result_recipient_email: resultRecipientEmail,
      scope: CERTIFICATION_RESULTS_BY_RECIPIENT_EMAIL_LINK_SCOPE,
    },
    config.authentication.secret,
    {
      expiresIn: `${daysBeforeExpiration}d`,
    },
  );
}

function extractTokenFromAuthChain(authChain) {
  if (!authChain) {
    return authChain;
  }
  const bearerIndex = authChain.indexOf('Bearer ');
  if (bearerIndex < 0) {
    return false;
  }
  return authChain.replace(/Bearer /g, '');
}

function extractCertificationResultsByRecipientEmailLink(token) {
  const decoded = getDecodedToken(token);
  if (!decoded.session_id || !decoded.result_recipient_email) {
    throw new InvalidResultRecipientTokenError();
  }

  if (decoded.scope !== CERTIFICATION_RESULTS_BY_RECIPIENT_EMAIL_LINK_SCOPE) {
    throw new InvalidResultRecipientTokenError();
  }

  return {
    resultRecipientEmail: decoded.result_recipient_email,
    sessionId: decoded.session_id,
  };
}

function extractUserId(token) {
  const decoded = getDecodedToken(token);
  return decoded.user_id || null;
}

const tokenService = {
  createCertificationResultsByRecipientEmailLinkToken,
  getDecodedToken,
  encodeToken,
  extractCertificationResultsByRecipientEmailLink,
  extractTokenFromAuthChain,
  extractUserId,
};

/**
 * @typedef TokenService
 */

export {
  createCertificationResultsByRecipientEmailLinkToken,
  extractCertificationResultsByRecipientEmailLink,
  extractTokenFromAuthChain,
  extractUserId,
  getDecodedToken,
  tokenService,
};
