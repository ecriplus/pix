import { logger } from '../../shared/infrastructure/utils/logger.js';
import { generateHash } from '../infrastructure/utils/crypto.js';

async function monitorApiTokenRoute(request, h, dependencies = { logger }) {
  const { username, refresh_token, grant_type, scope } = request.payload;

  if (grant_type === 'password') {
    const hash = generateHash(username);
    dependencies.logger.warn({ hash, grant_type, scope }, 'Authentication attempt');
  } else if (grant_type === 'refresh_token') {
    const hash = generateHash(refresh_token);
    dependencies.logger.warn({ hash, grant_type, scope }, 'Authentication attempt');
  } else {
    dependencies.logger.warn(request.payload, 'Authentication attempt with unknown method');
  }

  return true;
}

export const monitorPreHandlers = { monitorApiTokenRoute };
