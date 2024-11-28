import { LcmsCreateReleaseJob } from '../models/LcmsCreateReleaseJob.js';

/**
 * @param {{
 *   userId: number
 * } & import('./dependencies.js').Dependencies}
 */
export async function scheduleCreateLearningContentReleaseJob({ userId, lcmsCreateReleaseJobRepository }) {
  await lcmsCreateReleaseJobRepository.performAsync(new LcmsCreateReleaseJob({ userId }));
}
