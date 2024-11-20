import { AggregateImportError } from '../errors.js';
import { ImportSupOrganizationLearnersJob } from '../models/ImportSupOrganizationLearnersJob.js';

const validateCsvFile = async function ({
  Parser,
  organizationId,
  i18n,
  type,
  performJob,
  importSupOrganizationLearnersJobRepository,
  organizationImportRepository,
  importStorage,
}) {
  const organizationImport = await organizationImportRepository.getLastByOrganizationId(organizationId);
  const errors = [];
  let warningsData;

  try {
    const parser = await importStorage.getParser(
      { Parser, filename: organizationImport.filename },
      organizationId,
      i18n,
    );

    const { warnings } = parser.parse(parser.getFileEncoding());

    warningsData = warnings;

    if (performJob) {
      await importSupOrganizationLearnersJobRepository.performAsync(
        new ImportSupOrganizationLearnersJob({
          organizationImportId: organizationImport.id,
          type,
          locale: i18n.getLocale(),
        }),
      );
    }
  } catch (error) {
    if (error instanceof AggregateImportError) {
      errors.push(...error.meta);
    } else {
      errors.push(error);
    }

    await importStorage.deleteFile({ filename: organizationImport.filename });

    throw error;
  } finally {
    organizationImport.validate({ errors, warnings: warningsData });
    await organizationImportRepository.save(organizationImport);
  }
};

export { validateCsvFile };
