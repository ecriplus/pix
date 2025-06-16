import { SupOrganizationLearnerParser } from '../../infrastructure/serializers/csv/sup-organization-learner-parser.js';
import { getDataBuffer } from '../../infrastructure/utils/bufferize/get-data-buffer.js';

const getDeltaOrganizationLearnerIds = async function ({
  organizationImportId,
  i18n,
  supOrganizationLearnerRepository,
  organizationImportRepository,
  importStorage,
}) {
  const organizationImport = await organizationImportRepository.get(organizationImportId);

  const readableStream = await importStorage.readFile({ filename: organizationImport.filename });
  const buffer = await getDataBuffer(readableStream);
  const parser = SupOrganizationLearnerParser.buildParser(buffer, organizationImport.organizationId, i18n);

  const { learners } = parser.parse(parser.getFileEncoding());

  return supOrganizationLearnerRepository.getOrganizationLearnerIdsNotInList({
    organizationId: organizationImport.organizationId,
    studentNumberList: learners.map((learner) => learner.studentNumber),
  });
};

export { getDeltaOrganizationLearnerIds };
