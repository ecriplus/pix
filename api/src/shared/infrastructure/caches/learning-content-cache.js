import { learningContentCache as oldLearningContentCache } from './old/learning-content-cache.js';

export const learningContentCache = {
  async quit() {
    await oldLearningContentCache.quit();
  },
};
