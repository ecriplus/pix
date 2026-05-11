import { JobRepository, JobRetry } from '../../../../../shared/infrastructure/repositories/jobs/job-repository.js';
import { ImportFromSupJob } from '../../../domain/models/ImportFromSupJob.js';

class ImportFromSupJobRepository extends JobRepository {
  constructor() {
    super({
      name: ImportFromSupJob.name,
      retry: JobRetry.FEW_RETRY,
    });
  }
}

export const importSupOrganizationLearnersJobRepository = new ImportFromSupJobRepository();
