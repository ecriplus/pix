import { logger } from '../../../shared/infrastructure/utils/logger.js';
import { Organization } from '../models/Organization.js';

const getOrganizationDetails = async function ({
  organizationId,
  organizationForAdminRepository,
  schoolRepository,
  countryRepository,
}) {
  const organization = await organizationForAdminRepository.get({ organizationId });

  if (organization.countryCode) {
    try {
      const country = await countryRepository.getByCode(organization.countryCode);
      organization.setCountryName(country.name);
    } catch {
      logger.error({
        event: 'Not_found_country',
        message: `Le pays avec le code ${organization.countryCode} n'a pas été trouvé.`,
      });
    }
  }

  if (organization.type === Organization.types.SCO1D) {
    organization.code = await schoolRepository.getById({ organizationId });
  }
  return organization;
};

export { getOrganizationDetails };
