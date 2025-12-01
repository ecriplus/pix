import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';

export async function create({ sessionId, userId }) {
  const knexConn = DomainTransaction.getConnection();
  await knexConn('supervisor-accesses').insert({ sessionId, userId });
}

export async function isUserInvigilatorForSession({ sessionId, userId }) {
  const knexConn = DomainTransaction.getConnection();
  const result = await knexConn.select(1).from('supervisor-accesses').where({ sessionId, userId }).first();
  return Boolean(result);
}

export async function isUserInvigilatorForSessionCandidate({ invigilatorId, certificationCandidateId }) {
  const knexConn = DomainTransaction.getConnection();
  const result = await knexConn
    .select(1)
    .from('supervisor-accesses')
    .innerJoin('certification-candidates', 'supervisor-accesses.sessionId', 'certification-candidates.sessionId')
    .where({ 'certification-candidates.id': certificationCandidateId, 'supervisor-accesses.userId': invigilatorId })
    .first();
  return Boolean(result);
}
