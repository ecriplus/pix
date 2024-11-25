import {
  JobExpireIn,
  JobRepository,
  JobRetry,
} from '../../../../../shared/infrastructure/repositories/jobs/job-repository.js';
import { ImportScoCsvOrganizationLearnersJob } from '../../../domain/models/ImportScoCsvOrganizationLearnersJob.js';

class ImportScoCsvOrganizationLearnersJobRepository extends JobRepository {
  constructor() {
    super({
      name: ImportScoCsvOrganizationLearnersJob.name,
      expireIn: JobExpireIn.HIGH,
      retry: JobRetry.FEW_RETRY,
    });
  }
}

export const importScoCsvOrganizationLearnersJobRepository = new ImportScoCsvOrganizationLearnersJobRepository();
