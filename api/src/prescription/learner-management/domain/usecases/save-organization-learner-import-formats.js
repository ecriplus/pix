import { readFile } from 'node:fs/promises';

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { EntityValidationError, FileValidationError } from '../../../../shared/domain/errors.js';
import { OrganizationLearnerImportFormat } from '../models/OrganizationLearnerImportFormat.js';
/**
 * @param {Object} params
 * @param {Object} params.importFormats
 * @param {OrganizationLearnerImportFormatRepository} params.organizationLearnerImportFormatRepository
 * @returns {Promise<void>}
 */
const saveOrganizationLearnerImportFormats = withTransaction(async function ({
  userId,
  payload,
  organizationLearnerImportFormatRepository,
  dependencies = { readFile, jsonParse: JSON.parse },
}) {
  const errors = [];
  let rawImportFormats;
  try {
    const buffer = await dependencies.readFile(payload.path);
    rawImportFormats = dependencies.jsonParse(buffer);
  } catch (error) {
    throw new FileValidationError(error);
  }

  const organizationLearnerImportFormats = rawImportFormats.flatMap((rawImportFormat) => {
    try {
      return new OrganizationLearnerImportFormat({ ...rawImportFormat, createdAt: new Date(), createdBy: userId });
    } catch (error) {
      errors.push(error);
      return null;
    }
  });

  if (errors.length > 0) {
    throw EntityValidationError.fromMultipleEntityValidationErrors(errors);
  }

  return organizationLearnerImportFormatRepository.save({ organizationLearnerImportFormats });
});

export { saveOrganizationLearnerImportFormats };
