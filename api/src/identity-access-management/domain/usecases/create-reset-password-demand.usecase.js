import { createResetPasswordDemandEmail } from '../emails/create-reset-password-demand.email.js';

export const createResetPasswordDemand = async function ({
  email,
  locale,
  resetPasswordService,
  resetPasswordDemandRepository,
  userRepository,
  emailRepository,
}) {
  await userRepository.isUserExistingByEmail(email);

  const temporaryKey = await resetPasswordService.generateTemporaryKey();
  await resetPasswordDemandRepository.create({ email, temporaryKey });

  const resetPasswordDemandEmail = createResetPasswordDemandEmail({ email, temporaryKey, locale });
  await emailRepository.sendEmail(resetPasswordDemandEmail);
};
