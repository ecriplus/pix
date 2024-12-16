import { CommonCsvLearnerParser } from '../../../infrastructure/serializers/csv/common-csv-learner-parser.js';
import { getDataBuffer } from '../../../infrastructure/utils/bufferize/get-data-buffer.js';
import { AggregateImportError } from '../../errors.js';
import { ImportCommonOrganizationLearnersJob } from '../../models/ImportCommonOrganizationLearnersJob.js';
import { ImportOrganizationLearnerSet } from '../../models/ImportOrganizationLearnerSet.js';

const validateOrganizationLearnersFile = async function ({
  organizationImportId,
  organizationLearnerImportFormatRepository,
  importCommonOrganizationLearnersJobRepository,
  organizationImportRepository,
  importStorage,
  dependencies = { getDataBuffer },
}) {
  const errors = [];

  const organizationImport = await organizationImportRepository.get(organizationImportId);
  try {
    const organizationId = organizationImport.organizationId;
    const importFormat = await organizationLearnerImportFormatRepository.get(organizationId);

    const readableStream = await importStorage.readFile({ filename: organizationImport.filename });
    const buffer = await dependencies.getDataBuffer(readableStream);

    const parser = CommonCsvLearnerParser.buildParser({ buffer, importFormat });

    const learners = parser.parse(organizationImport.encoding);

    const learnerSet = ImportOrganizationLearnerSet.buildSet({
      organizationId,
      importFormat,
    });

    learnerSet.addLearners(learners);
    await importCommonOrganizationLearnersJobRepository.performAsync(
      new ImportCommonOrganizationLearnersJob({ organizationImportId: organizationImport.id }),
    );
  } catch (error) {
    if (Array.isArray(error)) {
      errors.push(...error);
    } else {
      errors.push(error);
    }
    await importStorage.deleteFile({ filename: organizationImport.filename });

    throw new AggregateImportError(errors);
  } finally {
    organizationImport.validate({ errors });
    await organizationImportRepository.save(organizationImport);
  }
};

export { validateOrganizationLearnersFile };
