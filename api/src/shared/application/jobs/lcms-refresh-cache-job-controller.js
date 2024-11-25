import { LcmsRefreshCacheJob } from '../../domain/models/LcmsRefreshCacheJob.js';
import { sharedUsecases as usecases } from '../../domain/usecases/index.js';
import { JobController } from './job-controller.js';

export class LcmsRefreshCacheJobController extends JobController {
  constructor() {
    super(LcmsRefreshCacheJob.name);
  }

  async handle() {
    await usecases.refreshLearningContentCache();
  }
}
