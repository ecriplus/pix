import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const save = async (flashAlgorithmConfiguration) => {
  const knexConn = DomainTransaction.getConnection();
  return knexConn('flash-algorithm-configurations').insert(flashAlgorithmConfiguration.toDTO());
};
