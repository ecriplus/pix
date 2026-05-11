const { chunk } = lodash;

import lodash from 'lodash';

import { withTransaction } from '../../../../../src/shared/domain/DomainTransaction.js';
import { ORGANIZATION_LEARNER_CHUNK_SIZE } from '../../../../shared/infrastructure/constants.js';
import { FregataParser } from '../../infrastructure/serializers/csv/parsers/fregata-parser.js';

const importOrganizationLearnersFromSIECLECSVFormat = withTransaction(async function ({
  organizationImportId,
  organizationLearnerRepository,
  organizationImportRepository,
  importStorage,
  i18n,
  chunkLength = ORGANIZATION_LEARNER_CHUNK_SIZE,
}) {
  let organizationImport;
  const errors = [];
  try {
    organizationImport = await organizationImportRepository.get(organizationImportId);
    const organizationId = organizationImport.organizationId;

    const parser = await importStorage.getParser(
      {
        Parser: FregataParser,
        filename: organizationImport.filename,
      },
      organizationId,
      i18n,
    );
    const result = parser.parse(organizationImport.encoding);
    const organizationLearnerData = result.learners;

    const organizationLearnersChunks = chunk(organizationLearnerData, chunkLength);
    const nationalStudentIdData = organizationLearnerData.map((learner) => learner.nationalStudentId, []);

    await organizationLearnerRepository.disableAllOrganizationLearnersInOrganization({
      organizationId,
      nationalStudentIds: nationalStudentIdData,
    });

    for (const chunk of organizationLearnersChunks) {
      await organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners(chunk, organizationId);
    }
  } catch (error) {
    errors.push(error);
    throw error;
  } finally {
    organizationImport.process({ errors });
    await organizationImportRepository.save(organizationImport);
    await importStorage.deleteFile({ filename: organizationImport.filename });
  }
});

export { importOrganizationLearnersFromSIECLECSVFormat };
