import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { OrganizationImportStatus } from '../models/OrganizationImportStatus.js';
import { ValidateFregataFileJob } from '../models/jobs/ValidateFregataFileJob.js';
import { ValidateSupFileJob } from '../models/jobs/ValidateSupFileJob.js';

const uploadCsvFile = async function ({
  payload,
  userId,
  organizationId,
  type,
  i18n,
  organizationImportRepository,
  validateFregataFileJobRepository,
  validateSupFileJobRepository,
  importStorage,
  Parser,
}) {
  const organizationImportId = await DomainTransaction.execute(async () => {
    const organizationImportInstance = OrganizationImportStatus.create({ organizationId, createdBy: userId });
    await organizationImportRepository.save(organizationImportInstance);

    const organizationImport = await organizationImportRepository.getLastByOrganizationId(organizationId);

    let filename;
    let encoding;
    const errors = [];

    try {
      filename = await importStorage.sendFile({ filepath: payload.path });

      const parserEncoding = await importStorage.getParser({ Parser, filename }, organizationId, i18n);
      encoding = parserEncoding.getFileEncoding();

      return organizationImport.id;
    } catch (error) {
      errors.push(error);
      throw error;
    } finally {
      organizationImport.upload({ filename, encoding, errors });
      await organizationImportRepository.save(organizationImport);
    }
  });

  if (type === 'FREGATA') {
    await validateFregataFileJobRepository.performAsync(
      new ValidateFregataFileJob({ organizationImportId, locale: i18n.getLocale() }),
    );
  } else {
    await validateSupFileJobRepository.performAsync(
      new ValidateSupFileJob({ organizationImportId, type, locale: i18n.getLocale() }),
    );
  }
};

export { uploadCsvFile };
