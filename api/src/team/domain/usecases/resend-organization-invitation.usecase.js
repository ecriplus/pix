const resendOrganizationInvitation = async function ({
  email,
  organizationId,
  organizationRepository,
  organizationInvitationRepository,
  organizationInvitationService,
}) {
  return organizationInvitationService.createOrUpdateOrganizationInvitation({
    email,
    organizationId,
    organizationRepository,
    organizationInvitationRepository,
  });
};

export { resendOrganizationInvitation };
