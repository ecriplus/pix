import { logger } from '../../infrastructure/utils/logger.js';

export async function initLearningContentCache({ LearningContentCache }) {
  logger.info({ event: 'learningcontent' }, 'initializing learning content cache');
  await LearningContentCache.instance.get();
  logger.info({ event: 'learningcontent' }, 'learning content cache initialized');
}
