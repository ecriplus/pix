import { JobController } from '../../../shared/application/jobs/job-controller.js';
import { logger } from '../../../shared/infrastructure/utils/logger.js';
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
      logger.info('Learning Content cache patched');
    } catch (e) {
      logger.error('Error while patching cache', e);
      throw e;
    }
  }
}
