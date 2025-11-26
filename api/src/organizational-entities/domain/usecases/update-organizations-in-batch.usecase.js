import { createReadStream } from 'node:fs';

import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import * as emailValidationService from '../../../shared/domain/services/email-validation-service.js';
import { CsvParser } from '../../../shared/infrastructure/serializers/csv/csv-parser.js';
import { getDataBuffer } from '../../../shared/infrastructure/utils/buffer.js';
import { logger } from '../../../shared/infrastructure/utils/logger.js';
import { ORGANIZATIONS_UPDATE_HEADER } from '../constants.js';
import { OrganizationBatchUpdateDTO } from '../dtos/OrganizationBatchUpdateDTO.js';
import {
  AdministrationTeamNotFound,
  CountryNotFoundError,
  DpoEmailInvalid,
  OrganizationBatchUpdateError,
  OrganizationNotFound,
  UnableToAttachChildOrganizationToParentOrganizationError,
} from '../errors.js';

/**
 * @typedef {function} updateOrganizationsInBatch
 * @param {Object} params
 * @param {string} params.filePath
 * @param {OrganizationForAdminRepository} params.organizationForAdminRepository
 * @param {AdministrationTeamRepository} params.administrationTeamRepository
 * @param {CountryRepository} params.countryRepository
 * @return {Promise<void>}
 */
export const updateOrganizationsInBatch = async function ({
  filePath,
  organizationForAdminRepository,
  administrationTeamRepository,
  countryRepository,
}) {
  const organizationBatchUpdateDtos = await _getCsvData(filePath);

  if (organizationBatchUpdateDtos.length === 0) return;

  await DomainTransaction.execute(async () => {
    await Promise.all(
      organizationBatchUpdateDtos.map(async (organizationBatchUpdateDto) => {
        await _checkOrganizationUpdate({
          organizationBatchUpdateDto,
          organizationForAdminRepository,
          administrationTeamRepository,
          countryRepository,
        });

        try {
          const organization = await organizationForAdminRepository.get({
            organizationId: organizationBatchUpdateDto.id,
          });
          organization.updateFromOrganizationBatchUpdateDto(organizationBatchUpdateDto);

          await organizationForAdminRepository.update({ organization });
        } catch {
          throw new OrganizationBatchUpdateError({
            meta: { organizationId: organizationBatchUpdateDto.id },
          });
        }
      }),
    );
  });
};

async function _checkOrganizationUpdate({
  organizationBatchUpdateDto,
  organizationForAdminRepository,
  administrationTeamRepository,
  countryRepository,
}) {
  const organization = await organizationForAdminRepository.exist({ organizationId: organizationBatchUpdateDto.id });
  if (!organization) {
    throw new OrganizationNotFound({
      meta: {
        organizationId: organizationBatchUpdateDto.id,
      },
    });
  }

  if (organizationBatchUpdateDto.parentOrganizationId) {
    const parentOrganization = await organizationForAdminRepository.exist({
      organizationId: organizationBatchUpdateDto.parentOrganizationId,
    });
    if (!parentOrganization) {
      throw new UnableToAttachChildOrganizationToParentOrganizationError({
        meta: {
          organizationId: organizationBatchUpdateDto.id,
          value: organizationBatchUpdateDto.parentOrganizationId,
        },
      });
    }
  }

  if (
    organizationBatchUpdateDto.dataProtectionOfficerEmail &&
    !emailValidationService.validateEmailSyntax(organizationBatchUpdateDto.dataProtectionOfficerEmail)
  ) {
    throw new DpoEmailInvalid({
      meta: {
        organizationId: organizationBatchUpdateDto.id,
        value: organizationBatchUpdateDto.dataProtectionOfficerEmail,
      },
    });
  }

  if (organizationBatchUpdateDto.administrationTeamId) {
    const administrationTeam = await administrationTeamRepository.getById(
      organizationBatchUpdateDto.administrationTeamId,
    );

    if (!administrationTeam) {
      throw new AdministrationTeamNotFound({
        meta: {
          administrationTeamId: organizationBatchUpdateDto.administrationTeamId,
        },
      });
    }
  }

  if (organizationBatchUpdateDto.countryCode) {
    await _checkCountryExists(organizationBatchUpdateDto.countryCode, countryRepository);
  }

  return organization;
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

async function _getCsvData(filePath) {
  const stream = createReadStream(filePath);
  const buffer = await getDataBuffer(stream);
  const csvParser = new CsvParser(buffer, ORGANIZATIONS_UPDATE_HEADER);
  const csvData = csvParser.parse('utf8');
  return csvData.map((row) => new OrganizationBatchUpdateDTO(row));
}
