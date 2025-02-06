/**
 * @typedef {import ('../usecases/index.js').QuestRepository} QuestRepository
 */
import { createReadStream } from 'node:fs';

import { getDataBuffer } from '../../../prescription/learner-management/infrastructure/utils/bufferize/get-data-buffer.js';
import { withTransaction } from '../../../shared/domain/DomainTransaction.js';
import { CsvColumn } from '../../../shared/infrastructure/serializers/csv/csv-column.js';
import { CsvParser } from '../../../shared/infrastructure/serializers/csv/csv-parser.js';
import { Quest } from '../models/Quest.js';

const questCsvHeader = {
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
  ],
};

export const createOrUpdateQuestsInBatch = withTransaction(
  /**
   * @param {Object} params - A parameter object.
   * @param {string} params.filePath - path of csv file which contains quests
   * @param {QuestRepository} params.questRepository - questRepository to use.
   * @returns {Promise<void>}
   */
  async ({ filePath, questRepository }) => {
    const stream = createReadStream(filePath);
    const buffer = await getDataBuffer(stream);

    const csvParser = new CsvParser(buffer, questCsvHeader);
    const csvData = csvParser.parse();
    const data = csvData.map(({ questId, content }) => {
      return new Quest({ id: questId || undefined, ...JSON.parse(content) });
    });

    return questRepository.saveInBatch({ quests: data });
  },
);
