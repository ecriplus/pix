import { withTransaction } from '../../../shared/domain/DomainTransaction.js';
import { logger } from '../../../shared/infrastructure/utils/logger.js';
import { AdministrationTeamNotFound, CountryNotFoundError, OrganizationLearnerTypeNotFound } from '../errors.js';

const updateOrganizationInformation = withTransaction(async function ({
  organization,
  organizationForAdminRepository,
  tagRepository,
  administrationTeamRepository,
  organizationLearnerTypeRepository,
  countryRepository,
}) {
  const existingOrganization = await organizationForAdminRepository.get({ organizationId: organization.id });

  let organizationLearnerType;
  if (organization.organizationLearnerType?.name) {
    try {
      organizationLearnerType = await organizationLearnerTypeRepository.getByName(
        organization.organizationLearnerType.name,
      );
      organization.organizationLearnerType = organizationLearnerType;
    } catch {
      throw new OrganizationLearnerTypeNotFound({
        meta: {
          organizationLearnerTypeName: organization.organizationLearnerType.name,
        },
      });
    }
  }

  const tagsToUpdate = await tagRepository.findByIds(organization.tagIds);

  await _checkAdministrationTeamExists(organization.administrationTeamId, administrationTeamRepository);

  if (organization.countryCode) {
    await _checkCountryExists(organization.countryCode, countryRepository);
  }

  existingOrganization.updateWithDataProtectionOfficerAndTags(
    organization,
    organization.dataProtectionOfficer,
    tagsToUpdate,
  );

  await organizationForAdminRepository.update({ organization: existingOrganization });

  return organizationForAdminRepository.get({ organizationId: organization.id });
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

async function _checkCountryExists(countryCode, countryRepository) {
  try {
    await countryRepository.getByCode(countryCode);
  } catch {
    logger.error({
      event: 'Not_found_country',
      message: `Le pays avec le code ${countryCode} n'a pas été trouvé.`,
    });
    throw new CountryNotFoundError({ message: `Country not found for code ${countryCode}`, meta: { countryCode } });
  }
}

export { updateOrganizationInformation };
