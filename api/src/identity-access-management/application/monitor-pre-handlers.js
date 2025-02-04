import { monitoringTools } from '../../shared/infrastructure/monitoring-tools.js';
import { generateHash } from '../infrastructure/utils/crypto.js';

// TODO: Add audience in it ?
async function monitorApiTokenRoute(request, h, dependencies = { monitoringTools }) {
  const { username, refresh_token, grant_type, scope } = request.payload;

  if (grant_type === 'password') {
    const hash = generateHash(username);
    dependencies.monitoringTools.logWarnWithCorrelationIds({
      message: 'Authentication attempt',
      hash,
      grant_type,
      scope,
    });
  } else if (grant_type === 'refresh_token') {
    const hash = generateHash(refresh_token);
    dependencies.monitoringTools.logWarnWithCorrelationIds({
      message: 'Authentication attempt',
      hash,
      grant_type,
    });
  } else {
    dependencies.monitoringTools.logWarnWithCorrelationIds({
      message: 'Authentication attempt with unknown method',
      ...request.payload,
    });
  }

  return true;
}

export const monitorPreHandlers = { monitorApiTokenRoute };
