import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { complementaryCertificationRepository } from '../../../shared/infrastructure/repositories/complementary-certification-repository.js';

export async function create({ complementaryCertificationKey, challenges }) {
  const knexConn = DomainTransaction.getConnection();

  const complementaryCertification = await complementaryCertificationRepository.getByKey(complementaryCertificationKey);

  const challengesDTO = challenges.map((challenge) => ({
    complementaryCertificationId: complementaryCertification.id,
    challengeId: challenge.id,
  }));

  await knexConn('certification-frameworks-challenges').insert(challengesDTO);
}
