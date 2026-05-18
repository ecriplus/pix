import { JobRepository, JobRetry } from '../../../../../shared/infrastructure/repositories/jobs/job-repository.js';
import { ImportFromGenericFileJob } from '../../../domain/models/jobs/ImportFromGenericFileJob.js';

class ImportFromGenericFileJobRepository extends JobRepository {
  constructor() {
    super({
      name: ImportFromGenericFileJob.name,
      retry: JobRetry.FEW_RETRY,
    });
  }
}

export const importFromGenericFileJobRepository = new ImportFromGenericFileJobRepository();
