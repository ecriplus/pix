import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';

export async function create({ complementaryCertificationKey, challenges }) {
  const knexConn = DomainTransaction.getConnection();

  const challengesDTO = challenges.map((challenge) => ({
    complementaryCertificationKey,
    challengeId: challenge.id,
  }));

  await knexConn('certification-frameworks-challenges').insert(challengesDTO);
}
