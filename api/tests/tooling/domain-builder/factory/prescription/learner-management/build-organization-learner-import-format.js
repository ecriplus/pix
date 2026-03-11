import { OrganizationLearnerImportFormat } from '../../../../../../src/prescription/learner-management/domain/models/OrganizationLearnerImportFormat.js';

export const buildOrganizationLearnerImportFormat = function ({
  id = 1,
  name = 'GENERIC',
  fileType = 'csv',
  config = {
    acceptedEncoding: ['utf-8'],
    unicityColumns: ['my_column'],
    validationRules: { formats: [{ name: 'my_column', type: 'string' }] },
    headers: [
      {
        name: 'Prénom apprenant',
        config: {
          property: 'firstName',
          validate: {
            type: 'string',
            required: true,
          },
          reconcile: {
            name: 'COMMON_FIRSTNAME',
            fieldId: 'reconcileField2',
            position: 2,
          },
        },
        required: true,
      },
    ],
  },
  createdAt = new Date('2025-01-01'),
  createdBy = 12,
} = {}) {
  return new OrganizationLearnerImportFormat({
    id,
    name,
    fileType,
    config,
    createdAt,
    createdBy,
  });
};
