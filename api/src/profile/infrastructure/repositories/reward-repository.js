import { REWARD_TYPES } from '../../../quest/domain/constants.js';
import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { RewardTypeDoesNotExistError } from '../../domain/errors.js';
import { Attestation } from '../../domain/models/Attestation.js';
import { Reward } from '../../domain/models/Reward.js';

export const getByIdAndType = async ({ rewardId, rewardType }) => {
  const knexConn = DomainTransaction.getConnection();
  try {
    const result = await knexConn(rewardType).where({ id: rewardId }).first();
    switch (rewardType) {
      case REWARD_TYPES.ATTESTATION:
        return new Attestation(result);
    }
  } catch (error) {
    throw new RewardTypeDoesNotExistError(error);
  }
};

export const getByAttestationKey = async ({ key }) => {
  const knexConn = DomainTransaction.getConnection();

  const result = await knexConn('attestations').select('id').where('attestations.key', key).first();

  if (!result) throw new NotFoundError('Attestation not found.');

  return new Reward({ id: result.id, type: REWARD_TYPES.ATTESTATION });
};
