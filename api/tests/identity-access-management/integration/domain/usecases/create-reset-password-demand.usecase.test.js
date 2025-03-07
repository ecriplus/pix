import { resetPasswordService } from '../../../../../src/identity-access-management/domain/services/reset-password.service.js';
import { createResetPasswordDemand } from '../../../../../src/identity-access-management/domain/usecases/create-reset-password-demand.usecase.js';
import { resetPasswordDemandRepository } from '../../../../../src/identity-access-management/infrastructure/repositories/reset-password-demand.repository.js';
import * as userRepository from '../../../../../src/identity-access-management/infrastructure/repositories/user.repository.js';
import * as emailRepository from '../../../../../src/shared/mail/infrastructure/repositories/email.repository.js';
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
    await createResetPasswordDemand({
      email,
      locale,
      emailRepository,
      resetPasswordService,
      resetPasswordDemandRepository,
      userRepository,
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
      await createResetPasswordDemand({
        email: unknownEmail,
        locale,
        emailRepository,
        resetPasswordService,
        resetPasswordDemandRepository,
        userRepository,
      });

      // then
      const resetPasswordDemand = await knex('reset-password-demands').where({ email: unknownEmail }).first();
      expect(resetPasswordDemand).to.not.exist;
    });
  });
});
