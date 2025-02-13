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
    new CsvColumn({
      property: 'deleteQuest',
      name: 'Delete quest',
      isRequired: false,
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
    const deleteQuestIds = [];
    const updatedOrNewQuest = [];

    const stream = createReadStream(filePath);
    const buffer = await getDataBuffer(stream);

    const csvParser = new CsvParser(buffer, questCsvHeader);
    const csvData = csvParser.parse();

    csvData.forEach(({ questId, content, deleteQuest }) => {
      if (deleteQuest?.toLowerCase() === 'oui' && questId) {
        deleteQuestIds.push(questId);
      } else {
        updatedOrNewQuest.push(new Quest({ id: questId || undefined, ...JSON.parse(content) }));
      }
    });

    if (deleteQuestIds.length > 0) {
      await questRepository.deleteByIds({ questIds: deleteQuestIds });
    }

    if (updatedOrNewQuest.length > 0) {
      await questRepository.saveInBatch({ quests: updatedOrNewQuest });
    }

    return true;
  },
);
