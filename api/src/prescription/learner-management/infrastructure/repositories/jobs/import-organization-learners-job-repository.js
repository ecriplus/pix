import { JobRepository, JobRetry } from '../../../../../shared/infrastructure/repositories/jobs/job-repository.js';
import { ImportFromSiecleJob } from '../../../domain/models/ImportFromSiecleJob.js';

class ImportFromSiecleJobRepository extends JobRepository {
  constructor() {
    super({
      name: ImportFromSiecleJob.name,
      retry: JobRetry.FEW_RETRY,
    });
  }
}

export const importOrganizationLearnersJobRepository = new ImportFromSiecleJobRepository();
