import { withTransaction } from '../../../shared/domain/DomainTransaction.js';
import { AdministrationTeamNotFound } from '../errors.js';

const updateOrganizationInformation = withTransaction(async function ({
  organization,
  organizationForAdminRepository,
  tagRepository,
  administrationTeamRepository,
  organizationLearnerTypeRepository,
  organizationVerificationService,
  countryRepository,
}) {
  const existingOrganization = await organizationForAdminRepository.get({
    organizationId: organization.id,
  });

  let organizationLearnerType;
  if (organization.organizationLearnerType.id) {
    organizationLearnerType = await organizationVerificationService.checkOrganizationLearnerTypeExists(
      organization.organizationLearnerType.id,
      organizationLearnerTypeRepository,
    );
    organization.organizationLearnerType = organizationLearnerType;
  }

  const tagsToUpdate = await tagRepository.findByIds(organization.tagIds);

  await _checkAdministrationTeamExists(organization.administrationTeamId, administrationTeamRepository);

  if (organization.countryCode) {
    await organizationVerificationService.checkCountryExists(organization.countryCode, countryRepository);
  }

  existingOrganization.updateWithDataProtectionOfficerAndTags(
    organization,
    organization.dataProtectionOfficer,
    tagsToUpdate,
  );

  await organizationForAdminRepository.update({
    organization: existingOrganization,
  });

  return organizationForAdminRepository.get({
    organizationId: organization.id,
  });
});

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
