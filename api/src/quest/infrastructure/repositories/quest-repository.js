import chunk from 'lodash/chunk.js';

import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { Quest } from '../../domain/models/Quest.js';

const toDomain = (quests) => quests.map((quest) => new Quest(quest));

const findAllWithReward = async () => {
  const knexConn = DomainTransaction.getConnection();

  const quests = await knexConn('quests').whereNotNull('rewardId');

  return toDomain(quests);
};

const findById = async ({ questId }) => {
  const knexConn = DomainTransaction.getConnection();

  const quest = await knexConn('quests').where('id', questId).first();

  if (!quest) return null;

  return new Quest(quest);
};

// envisager de mettre tableau vide en valeur par défaut des requirements si pas renseigné pour pas péter le code
// ensuite
const saveInBatch = async ({ quests }) => {
  const knexConn = DomainTransaction.getConnection();

  const chunks = chunk(quests, 10);
  const questIds = [];
  for (const chunk of chunks) {
    const dtoToSaveInDB = chunk.map((quest) => {
      const dto = quest.toDTO();
      return {
        ...dto,
        eligibilityRequirements: quest.eligibilityRequirements ? JSON.stringify(dto.eligibilityRequirements) : [],
        successRequirements: quest.successRequirements ? JSON.stringify(dto.successRequirements) : [],
        updatedAt: new Date(),
      };
    });
    const questsInserted = await knexConn('quests').insert(dtoToSaveInDB).onConflict('id').merge().returning('id');
    questsInserted.map((quest) => questIds.push(quest.id));
  }
  return questIds;
};

const save = async ({ quest }) => {
  const knexConn = DomainTransaction.getConnection();
  const dto = quest.toDTO();

  const dtoToSaveInDB = {
    ...dto,
    eligibilityRequirements: quest.eligibilityRequirements ? JSON.stringify(dto.eligibilityRequirements) : [],
    successRequirements: quest.successRequirements ? JSON.stringify(dto.successRequirements) : [],
    updatedAt: new Date(),
  };
  const result = await knexConn('quests').insert(dtoToSaveInDB).onConflict('id').merge().returning('id');
  return result[0].id;
};

const deleteByIds = async ({ questIds }) => {
  const knexConn = DomainTransaction.getConnection();
  return knexConn('quests').whereIn('id', questIds).delete();
};

export { deleteByIds, findAllWithReward, findById, save, saveInBatch };
