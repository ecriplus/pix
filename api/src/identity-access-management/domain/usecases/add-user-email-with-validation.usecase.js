import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import {
  EmailModificationDemandNotFoundOrExpiredError,
  InvalidVerificationCodeError,
} from '../../../shared/domain/errors.js';
import { NON_OIDC_IDENTITY_PROVIDERS } from '../constants/identity-providers.js';
import { AuthenticationMethod } from '../models/AuthenticationMethod.js';

const addUserEmailWithValidation = async function ({
  code,
  userId,
  userEmailRepository,
  userRepository,
  authenticationMethodRepository,
}) {
  const emailModificationDemand = await userEmailRepository.getEmailModificationDemandByUserId(userId);
  if (!emailModificationDemand || emailModificationDemand.action !== 'add-email') {
    throw new EmailModificationDemandNotFoundOrExpiredError();
  }

  if (code !== emailModificationDemand.code) {
    throw new InvalidVerificationCodeError();
  }

  await userRepository.checkIfEmailIsAvailable(emailModificationDemand.newEmail);

  const authenticationMethod = new AuthenticationMethod({
    userId,
    identityProvider: NON_OIDC_IDENTITY_PROVIDERS.PIX.code,
    authenticationComplement: new AuthenticationMethod.PixAuthenticationComplement({
      password: emailModificationDemand.password,
      shouldChangePassword: false,
    }),
  });

  await DomainTransaction.execute(async () => {
    await authenticationMethodRepository.create({ authenticationMethod });

    await userRepository.updateWithEmailConfirmed({
      id: userId,
      userAttributes: {
        email: emailModificationDemand.newEmail,
        emailConfirmedAt: new Date(),
      },
    });
  });

  return { email: emailModificationDemand.newEmail };
};

export { addUserEmailWithValidation };
