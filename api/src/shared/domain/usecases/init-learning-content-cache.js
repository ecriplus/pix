import { logger, SCOPES } from '../../infrastructure/utils/logger.js';

export async function initLearningContentCache({ LearningContentCache }) {
  logger.info({ event: SCOPES.LEARNING_CONTENT }, 'initializing learning content cache');
  await LearningContentCache.instance.get();
  logger.info({ event: SCOPES.LEARNING_CONTENT }, 'learning content cache initialized');
}
