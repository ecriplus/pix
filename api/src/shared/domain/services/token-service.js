import jsonwebtoken from 'jsonwebtoken';

import { config } from '../../../../src/shared/config.js';
import { InvalidTemporaryKeyError } from '../errors.js';

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

function decodeIfValid(token) {
  return new Promise((resolve, reject) => {
    const decoded = getDecodedToken(token);
    return !decoded ? reject(new InvalidTemporaryKeyError()) : resolve(decoded);
  });
}

function extractUserId(token) {
  const decoded = getDecodedToken(token);
  return decoded.user_id || null;
}

const tokenService = {
  decodeIfValid,
  getDecodedToken,
  encodeToken,
  extractTokenFromAuthChain,
  extractUserId,
};

/**
 * @typedef TokenService
 */

export { decodeIfValid, extractTokenFromAuthChain, extractUserId, getDecodedToken, tokenService };
