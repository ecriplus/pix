import { RefreshToken } from '../../../../../src/identity-access-management/domain/models/RefreshToken.js';
import { usecases } from '../../../../../src/identity-access-management/domain/usecases/index.js';
import { refreshTokenRepository } from '../../../../../src/identity-access-management/infrastructure/repositories/refresh-token.repository.js';
import { UnauthorizedError } from '../../../../../src/shared/application/http-errors.js';
import { temporaryStorage } from '../../../../../src/shared/infrastructure/key-value-storages/index.js';
import { catchErr, databaseBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Identity Access Management | Domain | UseCases | create-access-token-from-refresh-token', function () {
  let userId;

  beforeEach(async function () {
    userId = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({ userId });
    await databaseBuilder.commit();
    await temporaryStorage.flushAll();
  });

  context('when refresh token is valid', function () {
    it('creates a new access token', async function () {
      // given
      const source = 'pix';
      const audience = 'https://app.pix.fr';

      const refreshToken = RefreshToken.generate({ userId, source, audience });
      await refreshTokenRepository.save({ refreshToken });

      // when
      const { accessToken, expirationDelaySeconds } = await usecases.createAccessTokenFromRefreshToken({
        refreshToken: refreshToken.value,
        audience,
      });

      // then
      expect(accessToken).to.be.a('string');
      expect(expirationDelaySeconds).to.be.a('number');
    });
  });

  context('when refresh token is not valid', function () {
    it('throws an unauthorized error ', async function () {
      // given
      const audience = 'https://app.pix.fr';
      const unknownRefreshToken = 'unknown-refresh-token';

      // when
      const error = await catchErr(usecases.createAccessTokenFromRefreshToken)({
        refreshToken: unknownRefreshToken,
        audience,
      });

      // then
      expect(error).to.instanceOf(UnauthorizedError);
      expect(error.message).to.equal('Refresh token is invalid');
      expect(error.code).to.equal('INVALID_REFRESH_TOKEN');
    });
  });

  context('when the refresh token audience is not the same', function () {
    it('throws an unauthorized error', async function () {
      // given
      const source = 'pix';
      const audience = 'https://app.pix.fr';
      const badAudience = 'https://orga.pix.fr';

      const refreshToken = RefreshToken.generate({ userId, source, audience });
      await refreshTokenRepository.save({ refreshToken });

      // when
      const error = await catchErr(usecases.createAccessTokenFromRefreshToken)({
        refreshToken: refreshToken.value,
        audience: badAudience,
      });

      // then
      expect(error).to.instanceOf(UnauthorizedError);
      expect(error.message).to.equal('Refresh token is invalid');
      expect(error.code).to.equal('INVALID_REFRESH_TOKEN');
    });
  });
});
