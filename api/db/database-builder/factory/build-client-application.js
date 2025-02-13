import { cryptoService } from '../../../src/shared/domain/services/crypto-service.js';
import { databaseBuffer } from '../database-buffer.js';

export function buildClientApplication({
  id = databaseBuffer.getNextId(),
  name = 'clientApplication',
  clientId = 'client-id',
  clientSecret = 'super-secret',
  scopes = ['scope1', 'scope2'],
} = {}) {
  // eslint-disable-next-line no-sync
  const hashedSecret = cryptoService.hashPasswordSync(clientSecret);
  return databaseBuffer.pushInsertable({
    tableName: 'client_applications',
    values: {
      id,
      name,
      clientId,
      clientSecret: hashedSecret,
      scopes,
    },
  });
}
