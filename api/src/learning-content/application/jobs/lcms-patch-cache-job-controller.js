import { JobController } from '../../../shared/application/jobs/job-controller.js';
import { logger, SCOPES } from '../../../shared/infrastructure/utils/logger.js';
import { LcmsPatchCacheJob } from '../../domain/models/LcmsPatchCacheJob.js';
import { usecases } from '../../domain/usecases/index.js';

export class LcmsPatchCacheJobController extends JobController {
  constructor() {
    super(LcmsPatchCacheJob.name);
  }

  async handle({ data }) {
    try {
      await usecases.patchLearningContentCacheEntry({
        recordId: data.recordId,
        updatedRecord: data.updatedRecord,
        modelName: data.modelName,
      });
      logger.info({ event: SCOPES.LEARNING_CONTENT }, 'Learning Content cache patched');
    } catch (e) {
      logger.error({ err: e, event: SCOPES.LEARNING_CONTENT }, 'Error while patching cache');
      throw e;
    }
  }
}
