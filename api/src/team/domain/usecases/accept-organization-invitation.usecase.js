import { AlreadyExistingMembershipError } from '../../../shared/domain/errors.js';

const acceptOrganizationInvitation = async function ({
  organizationInvitationId,
  code,
  email,
  locale,
  organizationInvitationRepository,
  organizationInvitedUserRepository,
  userRepository,
}) {
  const organizationInvitedUser = await organizationInvitedUserRepository.get({ organizationInvitationId, email });

  try {
    organizationInvitedUser.acceptInvitation({ code });
  } catch (error) {
    if (error instanceof AlreadyExistingMembershipError) {
      await organizationInvitationRepository.markAsAccepted(organizationInvitationId);
    }
    throw error;
  }

  await _updateUserLocaleIfNeeded({ locale, userRepository, organizationInvitedUser });

  await organizationInvitedUserRepository.save({ organizationInvitedUser });
  return { id: organizationInvitedUser.currentMembershipId, isAdmin: organizationInvitedUser.currentRole === 'ADMIN' };
};

export { acceptOrganizationInvitation };

async function _updateUserLocaleIfNeeded({ locale, userRepository, organizationInvitedUser }) {
  if (locale) {
    const user = await userRepository.get(organizationInvitedUser.userId);
    const localeChanged = user.changeLocale(locale);
    if (localeChanged) {
      await userRepository.update({ id: user.id, locale: user.locale });
    }
  }
}
