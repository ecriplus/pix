import { logger } from '../../../shared/infrastructure/utils/logger.js';
import { CountryNotFoundError, OrganizationLearnerTypeNotFound } from '../errors.js';

const checkCountryExists = async (countryCode, countryRepository) => {
  try {
    await countryRepository.getByCode(countryCode);
  } catch {
    logger.error({
      event: 'Not_found_country',
      message: `Le pays avec le code ${countryCode} n'a pas été trouvé.`,
    });
    throw new CountryNotFoundError({ message: `Country not found for code ${countryCode}`, meta: { countryCode } });
  }
};

const checkOrganizationLearnerTypeExists = async (organizationLearnerTypeId, organizationLearnerTypeRepository) => {
  if (organizationLearnerTypeId) {
    try {
      return await organizationLearnerTypeRepository.getById(organizationLearnerTypeId);
    } catch {
      throw new OrganizationLearnerTypeNotFound({
        message: `Organization learner type not found for id ${organizationLearnerTypeId}`,
        meta: { organizationLearnerTypeId },
      });
    }
  }
};

export { checkCountryExists, checkOrganizationLearnerTypeExists };
