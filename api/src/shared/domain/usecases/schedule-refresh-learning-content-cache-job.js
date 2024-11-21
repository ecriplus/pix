import { LcmsRefreshCacheJob } from '../models/LcmsRefreshCacheJob.js';

export async function scheduleRefreshLearningContentCacheJob({ userId, lcmsRefreshCacheJobRepository }) {
  await lcmsRefreshCacheJobRepository.performAsync(new LcmsRefreshCacheJob({ userId }));
}
