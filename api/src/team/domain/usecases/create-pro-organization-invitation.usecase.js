/**
 * @param {Object} params
 * @param {string} params.organizationId
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.role
 * @param {string} params.locale
 * @param {OrganizationRepository} params.organizationRepository
 * @param {OrganizationInvitationRepository} params.organizationInvitationRepository
 * @param {OrganizationInvitationService} params.organizationInvitationService
 * @returns {Promise<void>}
 */
const createProOrganizationInvitation = async function ({
  organizationId,
  name,
  email,
  role,
  locale,
  organizationRepository,
  organizationInvitationRepository,
  organizationInvitationService,
}) {
  await organizationInvitationService.createProOrganizationInvitation({
    organizationRepository,
    organizationInvitationRepository,
    organizationId,
    name,
    email,
    role,
    locale,
  });
};

export { createProOrganizationInvitation };
