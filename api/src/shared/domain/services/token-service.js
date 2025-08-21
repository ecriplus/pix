import jsonwebtoken from 'jsonwebtoken';

import { config } from '../../../../src/shared/config.js';
import {
  InvalidExternalUserTokenError,
  InvalidResultRecipientTokenError,
  InvalidSessionResultTokenError,
  InvalidTemporaryKeyError,
} from '../errors.js';

const CERTIFICATION_RESULTS_BY_RECIPIENT_EMAIL_LINK_SCOPE = 'certificationResultsByRecipientEmailLink';

function createAccessTokenFromUser({ userId, source, audience }) {
  const expirationDelaySeconds = config.authentication.accessTokenLifespanMs / 1000;
  const accessToken = _createAccessToken({ userId, source, expirationDelaySeconds, audience });
  return { accessToken, expirationDelaySeconds };
}

function createAccessTokenFromAnonymousUser({ userId, audience }) {
  const expirationDelaySeconds = config.anonymous.accessTokenLifespanMs / 1000;
  return _createAccessToken({ userId, source: 'pix', expirationDelaySeconds, audience });
}

function createAccessTokenForSaml({ userId, audience }) {
  const expirationDelaySeconds = config.saml.accessTokenLifespanMs / 1000;
  return _createAccessToken({ userId, source: 'external', expirationDelaySeconds, audience });
}

function _createAccessToken({ userId, source, expirationDelaySeconds, audience }) {
  return jsonwebtoken.sign({ user_id: userId, source, aud: audience }, config.authentication.secret, {
    expiresIn: expirationDelaySeconds,
  });
}

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
 * @param {string} clientId
 * @param {string} source
 * @param {string | string[]} scope
 * @param {string} secret
 * @param {number | string} expiresIn
 * @returns {string}
 */
function createAccessTokenFromApplication(
  clientId,
  source,
  scope,
  secret = config.authentication.secret,
  expiresIn = config.authentication.accessTokenLifespanMs,
) {
  return jsonwebtoken.sign(
    {
      client_id: clientId,
      source,
      scope: Array.isArray(scope) ? scope.join(' ') : scope,
    },
    secret,
    { expiresIn },
  );
}

function createIdTokenForUserReconciliation(externalUser) {
  return jsonwebtoken.sign(
    {
      first_name: externalUser.firstName,
      last_name: externalUser.lastName,
      saml_id: externalUser.samlId,
    },
    config.authentication.secret,
    { expiresIn: config.authentication.tokenForStudentReconciliationLifespan },
  );
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

function createCertificationResultsLinkToken({ sessionId }) {
  return jsonwebtoken.sign(
    {
      session_id: sessionId,
      scope: config.jwtConfig.certificationResults.scope,
    },
    config.authentication.secret,
    {
      expiresIn: `${config.jwtConfig.certificationResults.tokenLifespan}`,
    },
  );
}

function createPasswordResetToken(userId) {
  return jsonwebtoken.sign(
    {
      user_id: userId,
    },
    config.authentication.secret,
    { expiresIn: config.authentication.passwordResetTokenLifespan },
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

function decodeIfValid(token) {
  return new Promise((resolve, reject) => {
    const decoded = getDecodedToken(token);
    return !decoded ? reject(new InvalidTemporaryKeyError()) : resolve(decoded);
  });
}

function getDecodedToken(token, secret = config.authentication.secret) {
  try {
    return jsonwebtoken.verify(token, secret);
  } catch {
    return false;
  }
}

function extractSamlId(token) {
  const decoded = getDecodedToken(token);
  return decoded.saml_id || null;
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

function extractCertificationResultsLink(token) {
  const decoded = getDecodedToken(token);
  if (!decoded.session_id) {
    throw new InvalidSessionResultTokenError();
  }

  if (decoded.scope !== config.jwtConfig.certificationResults.scope) {
    throw new InvalidSessionResultTokenError();
  }

  return {
    sessionId: decoded.session_id,
  };
}

function extractUserId(token) {
  const decoded = getDecodedToken(token);
  return decoded.user_id || null;
}

function extractClientId(token, secret = config.authentication.secret) {
  const decoded = getDecodedToken(token, secret);
  return decoded.client_id || null;
}

async function extractExternalUserFromIdToken(token) {
  const externalUser = getDecodedToken(token);

  if (!externalUser) {
    throw new InvalidExternalUserTokenError(
      'Une erreur est survenue. Veuillez réessayer de vous connecter depuis le médiacentre.',
    );
  }

  return {
    firstName: externalUser['first_name'],
    lastName: externalUser['last_name'],
    samlId: externalUser['saml_id'],
  };
}
const tokenService = {
  createAccessTokenFromUser,
  createAccessTokenForSaml,
  createAccessTokenFromApplication,
  createAccessTokenFromAnonymousUser,
  createIdTokenForUserReconciliation,
  createCertificationResultsByRecipientEmailLinkToken,
  createCertificationResultsLinkToken,
  createPasswordResetToken,
  decodeIfValid,
  getDecodedToken,
  encodeToken,
  extractExternalUserFromIdToken,
  extractCertificationResultsByRecipientEmailLink,
  extractSamlId,
  extractCertificationResultsLink,
  extractTokenFromAuthChain,
  extractUserId,
  extractClientId,
};

/**
 * @typedef TokenService
 */

export {
  createAccessTokenForSaml,
  createAccessTokenFromAnonymousUser,
  createAccessTokenFromApplication,
  createAccessTokenFromUser,
  createCertificationResultsByRecipientEmailLinkToken,
  createCertificationResultsLinkToken,
  createIdTokenForUserReconciliation,
  createPasswordResetToken,
  decodeIfValid,
  extractCertificationResultsByRecipientEmailLink,
  extractCertificationResultsLink,
  extractClientId,
  extractExternalUserFromIdToken,
  extractSamlId,
  extractTokenFromAuthChain,
  extractUserId,
  getDecodedToken,
  tokenService,
};
