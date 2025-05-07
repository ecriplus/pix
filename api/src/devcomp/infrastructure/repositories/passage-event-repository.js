import { PGSQL_UNIQUE_CONSTRAINT_VIOLATION_ERROR } from '../../../../db/pgsql-errors.js';
import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { DomainError } from '../../../shared/domain/errors.js';
import { PassageEventFactory } from '../../domain/factories/passage-event-factory.js';

async function record(event) {
  const knexConn = DomainTransaction.getConnection();
  try {
    await knexConn('passage-events').insert({
      passageId: event.passageId,
      sequenceNumber: event.sequenceNumber,
      occurredAt: event.occurredAt,
      type: event.type,
      data: event.data,
    });
  } catch (error) {
    if (error.code === PGSQL_UNIQUE_CONSTRAINT_VIOLATION_ERROR) {
      throw new DomainError('There is already an existing event for this passageId and sequenceNumber');
    }

    throw error;
  }
}

async function getAllByPassageId({ passageId }) {
  const knexConn = DomainTransaction.getConnection();
  const passageEvents = await knexConn('passage-events').where('passageId', passageId).orderBy('sequenceNumber');

  return passageEvents.map((passageEvent) => _toDomain(passageEvent));
}

function _toDomain(passageEvent) {
  return PassageEventFactory.build({
    ...passageEvent,
    ...passageEvent.data,
  });
}

export { getAllByPassageId, record };
