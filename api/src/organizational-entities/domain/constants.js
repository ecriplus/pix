import { CsvColumn } from '../../../src/shared/infrastructure/serializers/csv/csv-column.js';

export const ORGANIZATION_FEATURES_HEADER = {
  columns: [
    new CsvColumn({
      property: 'featureId',
      name: 'Feature ID',
      isRequired: true,
    }),
    new CsvColumn({
      property: 'organizationId',
      name: 'Organization ID',
      isRequired: true,
    }),
    new CsvColumn({
      property: 'params',
      name: 'Params',
      isRequired: false,
    }),
    new CsvColumn({
      property: 'deleteLearner',
      name: 'Delete Learner',
      isRequired: false,
    }),
  ],
};
