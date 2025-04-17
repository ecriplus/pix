import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';

async function record(event) {
  const knexConn = DomainTransaction.getConnection();
  await knexConn('passage-events').insert({
    passageId: event.passageId,
    sequenceNumber: event.sequenceNumber,
    occurredAt: event.occurredAt,
    type: event.type,
    data: event.data,
  });
}

export { record };
