import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { LastUserApplicationConnection } from '../../domain/models/LastUserApplicationConnection.js';
const TABLE_NAME = 'last-user-application-connections';

async function upsert({ userId, application, lastLoggedAt }) {
  const knexConn = DomainTransaction.getConnection();
  return knexConn(TABLE_NAME)
    .insert({ userId, application, lastLoggedAt })
    .onConflict(['userId', 'application'])
    .merge({ lastLoggedAt });
}

async function findByUserId(userId) {
  const knexConn = DomainTransaction.getConnection();
  const lastUserApplicationConnections = await knexConn(TABLE_NAME).where({ userId });

  return lastUserApplicationConnections.map(_toDomain);
}

export const lastUserApplicationConnectionsRepository = { upsert, findByUserId };

function _toDomain(lastUserApplicationConnection) {
  return new LastUserApplicationConnection({
    id: lastUserApplicationConnection.id,
    userId: lastUserApplicationConnection.userId,
    application: lastUserApplicationConnection.application,
    lastLoggedAt: lastUserApplicationConnection.lastLoggedAt,
  });
}
