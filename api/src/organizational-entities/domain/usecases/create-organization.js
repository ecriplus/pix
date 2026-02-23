import { logger } from '../../../shared/infrastructure/utils/logger.js';
import {
  AdministrationTeamNotFound,
  CountryNotFoundError,
  OrganizationLearnerTypeNotFound,
  UnableToAttachChildOrganizationToParentOrganizationError,
} from '../errors.js';
import { Organization } from '../models/Organization.js';

const createOrganization = async function ({
  organization,
  administrationTeamRepository,
  countryRepository,
  dataProtectionOfficerRepository,
  organizationForAdminRepository,
  organizationLearnerTypeRepository,
  organizationCreationValidator,
  schoolRepository,
  codeGenerator,
}) {
  if (organization.parentOrganizationId) {
    const parentOrganization = await organizationForAdminRepository.get({
      organizationId: organization.parentOrganizationId,
    });

    _assertParentOrganizationIsNotChildOrganization(parentOrganization);
  }

  organizationCreationValidator.validate(organization);

  await _checkOrganizationLearnerTypeExists(organization.organizationLearnerType.id, organizationLearnerTypeRepository);

  await _checkCountryExists(organization.countryCode, countryRepository);

  const administrationTeam = await administrationTeamRepository.getById(organization.administrationTeamId);

  if (!administrationTeam) {
    throw new AdministrationTeamNotFound({
      meta: {
        administrationTeamId: organization.administrationTeamId,
      },
    });
  }

  const savedOrganization = await organizationForAdminRepository.save({ organization });

  await dataProtectionOfficerRepository.create({
    organizationId: savedOrganization.id,
    firstName: organization.dataProtectionOfficer.firstName,
    lastName: organization.dataProtectionOfficer.lastName,
    email: organization.dataProtectionOfficer.email,
  });

  if (savedOrganization.type === Organization.types.SCO1D) {
    const code = await codeGenerator.generate(schoolRepository);
    await schoolRepository.save({ organizationId: savedOrganization.id, code });
  }
  return await organizationForAdminRepository.get({ organizationId: savedOrganization.id });
};

export { createOrganization };

function _assertParentOrganizationIsNotChildOrganization(parentOrganization) {
  if (parentOrganization.parentOrganizationId) {
    throw new UnableToAttachChildOrganizationToParentOrganizationError({
      code: 'UNABLE_TO_ATTACH_CHILD_ORGANIZATION_TO_ANOTHER_CHILD_ORGANIZATION',
      message: 'Unable to attach child organization to parent organization which is also a child organization',
      meta: {
        grandParentOrganizationId: parentOrganization.parentOrganizationId,
        parentOrganizationId: parentOrganization.id,
      },
    });
  }
}

async function _checkOrganizationLearnerTypeExists(organizationLearnerTypeId, organizationLearnerTypeRepository) {
  if (organizationLearnerTypeId) {
    try {
      await organizationLearnerTypeRepository.getById(organizationLearnerTypeId);
    } catch {
      throw new OrganizationLearnerTypeNotFound({
        message: `Organization learner type not found for id ${organizationLearnerTypeId}`,
        meta: { organizationLearnerTypeId },
      });
    }
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
