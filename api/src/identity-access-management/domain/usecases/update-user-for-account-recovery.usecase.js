import { featureToggles } from '../../../shared/infrastructure/feature-toggles/index.js';
import { NON_OIDC_IDENTITY_PROVIDERS } from '../constants/identity-providers.js';
import { AuthenticationMethod } from '../models/AuthenticationMethod.js';

/**
 * @param {{
 *   password: string,
 *   temporaryKey: string,
 *   accountRecoveryDemandRepository: AccountRecoveryDemandRepository,
 *   authenticationMethodRepository: AuthenticationMethodRepository,
 *   userRepository: UserRepository,
 *   cryptoService: CryptoService,
 *   scoAccountRecoveryService: ScoAccountRecoveryService,
 * }} params
 * @return {Promise<void>}
 */
export const updateUserForAccountRecovery = async function ({
  password,
  temporaryKey,
  userRepository,
  authenticationMethodRepository,
  accountRecoveryDemandRepository,
  scoAccountRecoveryService,
  cryptoService,
}) {
  const { userId, newEmail } = await scoAccountRecoveryService.retrieveAndValidateAccountRecoveryDemand({
    temporaryKey,
    accountRecoveryDemandRepository,
    userRepository,
  });
  const hashedPassword = await cryptoService.hashPassword(password);

  const hasAnAuthenticationMethodFromPix = await authenticationMethodRepository.hasIdentityProviderPIX({ userId });

  if (hasAnAuthenticationMethodFromPix) {
    await authenticationMethodRepository.updatePassword({
      userId,
      hashedPassword,
    });
  } else {
    const authenticationMethodFromPix = new AuthenticationMethod({
      userId,
      identityProvider: NON_OIDC_IDENTITY_PROVIDERS.PIX.code,
      authenticationComplement: new AuthenticationMethod.PixAuthenticationComplement({
        password: hashedPassword,
        shouldChangePassword: false,
      }),
    });
    await authenticationMethodRepository.create({
      authenticationMethod: authenticationMethodFromPix,
    });
  }

  const now = new Date();
  const userValuesToUpdate = {
    // username: null // Uncomment this line when the feature toggle will be deleted
    cgu: true,
    email: newEmail,
    emailConfirmedAt: now,
    lastTermsOfServiceValidatedAt: now,
  };

  // Remove this if when the feature toggle will be activated
  const toggle = await featureToggles.get('isNewAccountRecoveryEnabled');
  if (toggle) {
    userValuesToUpdate.username = null;
    // move the following line out if
    await authenticationMethodRepository.removeByUserIdAndIdentityProvider({
      userId,
      identityProvider: NON_OIDC_IDENTITY_PROVIDERS.GAR.code,
    });
  }

  await userRepository.updateWithEmailConfirmed({
    id: userId,
    userAttributes: userValuesToUpdate,
  });
  await accountRecoveryDemandRepository.markAsBeingUsed(temporaryKey);
};
