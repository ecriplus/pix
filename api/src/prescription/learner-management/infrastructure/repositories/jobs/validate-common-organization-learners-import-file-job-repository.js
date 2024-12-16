import {
  JobExpireIn,
  JobRepository,
  JobRetry,
} from '../../../../../shared/infrastructure/repositories/jobs/job-repository.js';
import { ValidateCommonOrganizationImportFileJob } from '../../../domain/models/ValidateCommonOrganizationImportFileJob.js';

class ValidateCommonOrganizationImportFileJobRepository extends JobRepository {
  constructor() {
    super({
      name: ValidateCommonOrganizationImportFileJob.name,
      expireIn: JobExpireIn.HIGH,
      retry: JobRetry.FEW_RETRY,
    });
  }
}

export const validateCommonOrganizationImportFileJobRepository =
  new ValidateCommonOrganizationImportFileJobRepository();
