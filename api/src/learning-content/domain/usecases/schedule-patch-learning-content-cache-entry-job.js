import { LcmsPatchCacheJob } from '../models/LcmsPatchCacheJob.js';

/**
 * @param {{
 *   userId: number
 * } & import('./dependencies.js').Dependencies}
 */
export async function schedulePatchLearningContentCacheEntryJob({
  userId,
  recordId,
  updatedRecord,
  modelName,
  lcmsPatchCacheJobRepository,
}) {
  await lcmsPatchCacheJobRepository.performAsync(new LcmsPatchCacheJob({ userId, recordId, updatedRecord, modelName }));
}
