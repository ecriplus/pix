import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { OrganizationImportStatus } from '../models/OrganizationImportStatus.js';
import { ValidateCsvOrganizationImportFileJob } from '../models/ValidateCsvOrganizationImportFileJob.js';

const uploadCsvFile = async function ({
  payload,
  userId,
  organizationId,
  type,
  i18n,
  organizationImportRepository,
  validateCsvOrganizationImportFileJobRepository,
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

  await validateCsvOrganizationImportFileJobRepository.performAsync(
    new ValidateCsvOrganizationImportFileJob({
      organizationImportId,
      type,
      locale: i18n.getLocale(),
    }),
  );
};

export { uploadCsvFile };
