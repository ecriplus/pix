import { UnauthorizedError } from '../../../shared/application/http-errors.js';

const createAccessTokenFromRefreshToken = async function ({
  refreshToken,
  scope,
  refreshTokenRepository,
  tokenService,
  audience,
}) {
  const foundRefreshToken = await refreshTokenRepository.findByToken({ token: refreshToken });

  if (!foundRefreshToken) throw new UnauthorizedError('Refresh token is invalid', 'INVALID_REFRESH_TOKEN');

  if (scope && foundRefreshToken.scope && scope !== foundRefreshToken.scope) {
    throw new UnauthorizedError('Refresh token is invalid', 'INVALID_REFRESH_TOKEN');
  }

  return tokenService.createAccessTokenFromUser({
    userId: foundRefreshToken.userId,
    source: foundRefreshToken.source,
    audience,
  });
};

export { createAccessTokenFromRefreshToken };
