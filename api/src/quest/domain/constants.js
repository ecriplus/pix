import { ATTESTATIONS_TABLE_NAME } from '../../../db/migrations/20240820101115_add-attestations-table.js';
import { CsvColumn } from '../../shared/infrastructure/serializers/csv/csv-column.js';

export const REWARD_TYPES = { ATTESTATION: ATTESTATIONS_TABLE_NAME };
export const QUEST_HEADER = {
  columns: [
    new CsvColumn({
      property: 'questId',
      name: 'Quest ID',
      isRequired: true,
    }),
    new CsvColumn({
      property: 'content',
      name: 'Json configuration for quest',
      isRequired: true,
    }),
    new CsvColumn({
      property: 'deleteQuest',
      name: 'Delete quest',
      isRequired: false,
    }),
  ],
};
export const COMBINED_COURSE_HEADER = {
  columns: [
    new CsvColumn({
      property: 'organizationIds',
      name: 'Identifiant des organisations*',
      isRequired: true,
    }),
    new CsvColumn({
      property: 'content',
      name: 'Json configuration for quest*',
      isRequired: true,
    }),
    new CsvColumn({
      property: 'creatorId',
      name: 'Identifiant du createur des campagnes*',
      isRequired: false,
    }),
  ],
};
