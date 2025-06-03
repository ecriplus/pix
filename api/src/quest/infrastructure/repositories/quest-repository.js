import chunk from 'lodash/chunk.js';

import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { Quest } from '../../domain/models/Quest.js';

const toDomain = (quests) => quests.map((quest) => new Quest(quest));

const findAll = async () => {
  const knexConn = DomainTransaction.getConnection();

  const quests = await knexConn('quests');

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

  for (const chunk of chunks) {
    const dtoToSaveInDB = chunk.map((quest) => {
      const dto = quest.toDTO();
      return {
        ...dto,
        eligibilityRequirements: JSON.stringify(dto.eligibilityRequirements),
        successRequirements: JSON.stringify(dto.successRequirements),
        updatedAt: new Date(),
      };
    });
    await knexConn('quests').insert(dtoToSaveInDB).onConflict('id').merge();
  }
};

const deleteByIds = async ({ questIds }) => {
  const knexConn = DomainTransaction.getConnection();
  return knexConn('quests').whereIn('id', questIds).delete();
};

export { deleteByIds, findAll, findById, saveInBatch };
