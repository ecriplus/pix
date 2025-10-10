import { AdministrationTeamNotFound } from '../errors.js';

const updateOrganizationInformation = async function ({
  organization,
  organizationForAdminRepository,
  tagRepository,
  administrationTeamRepository,
}) {
  const existingOrganization = await organizationForAdminRepository.get({ organizationId: organization.id });
  const tagsToUpdate = await tagRepository.findByIds(organization.tagIds);

  await _checkAdministrationTeamExists(organization.administrationTeamId, administrationTeamRepository);

  existingOrganization.updateWithDataProtectionOfficerAndTags(
    organization,
    organization.dataProtectionOfficer,
    tagsToUpdate,
  );

  await organizationForAdminRepository.update({ organization: existingOrganization });

  return organizationForAdminRepository.get({ organizationId: organization.id });
};

async function _checkAdministrationTeamExists(administrationTeamId, administrationTeamRepository) {
  const existingAdministrationTeam = await administrationTeamRepository.getById(administrationTeamId);

  if (!existingAdministrationTeam) {
    throw new AdministrationTeamNotFound({
      meta: {
        administrationTeamId: administrationTeamId,
      },
    });
  }
}

export { updateOrganizationInformation };
