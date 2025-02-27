import 'dotenv/config';

import { databaseConnections } from '../db/database-connections.js';
import { usecases } from '../src/learning-content/domain/usecases/index.js';
import { learningContentCache } from '../src/shared/infrastructure/caches/learning-content-cache.js';
import { logger, SCOPES } from '../src/shared/infrastructure/utils/logger.js';

logger.info({ event: SCOPES.LEARNING_CONTENT }, 'Starting refreshing Learning Content');

try {
  await usecases.refreshLearningContentCache();
  logger.info({ event: SCOPES.LEARNING_CONTENT }, 'Learning Content refreshed');
} catch (e) {
  logger.error({ err: e, event: SCOPES.LEARNING_CONTENT }, 'Error while reloading cache');
} finally {
  await learningContentCache.quit();
  await databaseConnections.disconnect();
}
