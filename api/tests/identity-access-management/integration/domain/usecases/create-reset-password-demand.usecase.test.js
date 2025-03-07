import { usecases } from '../../../../../src/identity-access-management/domain/usecases/index.js';
import { databaseBuilder, expect, knex } from '../../../../test-helper.js';

describe('Integration | Identity Access Management | Domain | UseCase | create-reset-password-demand', function () {
  const locale = 'fr';

  it('creates a reset password demand', async function () {
    // given
    const email = 'user@example.net';
    const userId = databaseBuilder.factory.buildUser({ email }).id;
    databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({ userId });
    await databaseBuilder.commit();

    // when
    await usecases.createResetPasswordDemand({
      email,
      locale,
    });

    // then
    const resetPasswordDemand = await knex('reset-password-demands').where({ email }).first();
    expect(resetPasswordDemand).to.exist;
  });

  context('when user account does not exist with given email', function () {
    it('does not create a reset password demand', async function () {
      // given
      const unknownEmail = 'unknown@example.net';

      // when
      await usecases.createResetPasswordDemand({
        email: unknownEmail,
        locale,
      });

      // then
      const resetPasswordDemand = await knex('reset-password-demands').where({ email: unknownEmail }).first();
      expect(resetPasswordDemand).to.not.exist;
    });
  });
});
