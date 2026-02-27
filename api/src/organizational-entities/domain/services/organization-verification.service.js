import { logger } from '../../../shared/infrastructure/utils/logger.js';
import { CountryNotFoundError } from '../errors.js';

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

export { checkCountryExists };
