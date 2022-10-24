const bluebird = require('bluebird');
const { v4: uuidv4 } = require('uuid');
const settings = require('../../config');
const tokenService = require('./token-service');
const { UnauthorizedError } = require('../../application/http-errors');
const refreshTokenTemporaryStorage = require('../../infrastructure/temporary-storage').withPrefix('refresh-tokens:');
const userRefreshTokensTemporaryStorage = require('../../infrastructure/temporary-storage').withPrefix(
  'user-refresh-tokens:'
);

const REFRESH_TOKEN_EXPIRATION_DELAY_ADDITION_SECONDS = 60 * 60; // 1 hour

function _prefixForUser(userId) {
  return `${userId}:`;
}

async function createRefreshTokenFromUserId({ userId, source, uuidGenerator = uuidv4 }) {
  const expirationDelaySeconds = settings.authentication.refreshTokenLifespanMs / 1000;
  const refreshToken = `${_prefixForUser(userId)}${uuidGenerator()}`;

  await refreshTokenTemporaryStorage.save({
    key: refreshToken,
    value: { type: 'refresh_token', userId, source },
    expirationDelaySeconds,
  });
  await userRefreshTokensTemporaryStorage.lpush({ key: userId, value: refreshToken });
  await userRefreshTokensTemporaryStorage.expire({
    key: userId,
    expirationDelaySeconds: expirationDelaySeconds + REFRESH_TOKEN_EXPIRATION_DELAY_ADDITION_SECONDS,
  });

  return refreshToken;
}

async function createAccessTokenFromRefreshToken({ refreshToken }) {
  const { userId, source } = (await refreshTokenTemporaryStorage.get(refreshToken)) || {};
  if (!userId) throw new UnauthorizedError('Refresh token is invalid', 'INVALID_REFRESH_TOKEN');

  const refreshTokenRemainingExpirationSeconds = await refreshTokenTemporaryStorage.ttl(refreshToken);
  const userRefreshTokenRemainingExpirationSeconds = await userRefreshTokensTemporaryStorage.ttl(refreshToken);
  const userRefreshTokens = await userRefreshTokensTemporaryStorage.lrange(userId);
  const refreshTokenFound = userRefreshTokens.find((userRefreshToken) => userRefreshToken === refreshToken);

  if (!refreshTokenFound) {
    await userRefreshTokensTemporaryStorage.lpush({ key: userId, value: refreshToken });
    if (refreshTokenRemainingExpirationSeconds > userRefreshTokenRemainingExpirationSeconds) {
      await userRefreshTokensTemporaryStorage.expire({
        key: userId,
        expirationDelaySeconds:
          refreshTokenRemainingExpirationSeconds + REFRESH_TOKEN_EXPIRATION_DELAY_ADDITION_SECONDS,
      });
    }
  }

  return tokenService.createAccessTokenFromUser(userId, source);
}

async function revokeRefreshToken({ refreshToken }) {
  const { userId } = (await refreshTokenTemporaryStorage.get(refreshToken)) || {};
  if (!userId) return;
  await userRefreshTokensTemporaryStorage.lrem({ key: userId, valueToRemove: refreshToken });
  await refreshTokenTemporaryStorage.delete(refreshToken);
}

async function revokeRefreshTokensForUserId({ userId }) {
  const refreshTokens = await userRefreshTokensTemporaryStorage.lrange(userId);
  await userRefreshTokensTemporaryStorage.delete(userId);
  await bluebird.mapSeries(refreshTokens, (refreshToken) => {
    return refreshTokenTemporaryStorage.delete(refreshToken);
  });
  await refreshTokenTemporaryStorage.deleteByPrefix(_prefixForUser(userId));
}

module.exports = {
  createRefreshTokenFromUserId,
  createAccessTokenFromRefreshToken,
  revokeRefreshToken,
  revokeRefreshTokensForUserId,

  refreshTokenTemporaryStorageForTests: refreshTokenTemporaryStorage,
  userRefreshTokensTemporaryStorageForTests: userRefreshTokensTemporaryStorage,
};
