import { PGSQL_UNIQUE_CONSTRAINT_VIOLATION_ERROR } from '../../../../db/pgsql-errors.js';
import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { DomainError } from '../../../shared/domain/errors.js';

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

export { record };
