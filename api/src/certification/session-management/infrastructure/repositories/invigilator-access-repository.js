import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';

export async function create({ sessionId, userId }) {
  const knexConn = DomainTransaction.getConnection();
  await knexConn('invigilator_accesses').insert({ sessionId, userId });
}

export async function isUserInvigilatorForSession({ sessionId, userId }) {
  const knexConn = DomainTransaction.getConnection();
  const result = await knexConn.select(1).from('invigilator_accesses').where({ sessionId, userId }).first();
  return Boolean(result);
}

export async function isUserInvigilatorForSessionCandidate({ invigilatorId, certificationCandidateId }) {
  const knexConn = DomainTransaction.getConnection();
  const result = await knexConn
    .select(1)
    .from('invigilator_accesses')
    .innerJoin('certification-candidates', 'invigilator_accesses.sessionId', 'certification-candidates.sessionId')
    .where({ 'certification-candidates.id': certificationCandidateId, 'invigilator_accesses.userId': invigilatorId })
    .first();
  return Boolean(result);
}
