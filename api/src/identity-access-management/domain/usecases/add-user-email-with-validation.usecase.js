import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import {
  EmailModificationDemandNotFoundOrExpiredError,
  InvalidVerificationCodeError,
} from '../../../shared/domain/errors.js';
import { AuditLoggingJob } from '../../../shared/domain/models/jobs/AuditLoggingJob.js';
import { NON_OIDC_IDENTITY_PROVIDERS } from '../constants/identity-providers.js';
import { AuthenticationMethod } from '../models/AuthenticationMethod.js';

const addUserEmailWithValidation = async function ({
  code,
  userId,
  userEmailRepository,
  userRepository,
  authenticationMethodRepository,
  auditLoggingJobRepository,
}) {
  const emailModificationDemand = await userEmailRepository.getEmailModificationDemandByUserId(userId);
  if (!emailModificationDemand || emailModificationDemand.action !== 'add-email') {
    throw new EmailModificationDemandNotFoundOrExpiredError();
  }

  if (code !== emailModificationDemand.code) {
    throw new InvalidVerificationCodeError();
  }

  const { newEmail, password } = emailModificationDemand;

  await userRepository.checkIfEmailIsAvailable(newEmail);

  const authenticationMethod = new AuthenticationMethod({
    userId,
    identityProvider: NON_OIDC_IDENTITY_PROVIDERS.PIX.code,
    authenticationComplement: new AuthenticationMethod.PixAuthenticationComplement({
      password,
      shouldChangePassword: false,
    }),
  });

  await DomainTransaction.execute(async () => {
    await authenticationMethodRepository.create({ authenticationMethod });

    await userRepository.updateWithEmailConfirmed({
      id: userId,
      userAttributes: {
        email: newEmail,
        emailConfirmedAt: new Date(),
      },
    });
  });

  await userEmailRepository.deleteEmailModificationDemandByUserId(userId);

  await auditLoggingJobRepository.performAsync(
    AuditLoggingJob.forUser({
      client: 'PIX_APP',
      action: 'EMAIL_ADDED',
      role: 'USER',
      userId,
      updatedByUserId: userId,
      data: { email: newEmail },
    }),
  );

  return { email: newEmail };
};

export { addUserEmailWithValidation };
