import 'dotenv/config';

import { sharedUsecases as usecases } from '../src/shared/domain/usecases/index.js';
import { learningContentCache } from '../src/shared/infrastructure/caches/learning-content-cache.js';
import { logger } from '../src/shared/infrastructure/utils/logger.js';

logger.info('Starting refreshing Learning Content');
usecases
  .refreshLearningContentCache()
  .then(() => {
    logger.info('Learning Content refreshed');
  })
  .catch((e) => logger.error('Error while reloading cache', e))
  .finally(() => learningContentCache.quit());
