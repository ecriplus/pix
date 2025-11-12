import { JobRepository } from '../../../../../shared/infrastructure/repositories/jobs/job-repository.js';
import { SaveOrganizationLearnerPassageForUserJob } from '../../../domain/models/SaveOrganizationLearnerPassageForUserJob.js';

class SaveOrganizationLearnerPassageForUserJobRepository extends JobRepository {
  constructor() {
    super({
      name: SaveOrganizationLearnerPassageForUserJob.name,
    });
  }
}

export const saveOrganizationLearnerPassageForUserJobRepository =
  new SaveOrganizationLearnerPassageForUserJobRepository();
