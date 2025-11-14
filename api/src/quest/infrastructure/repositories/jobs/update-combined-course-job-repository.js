import { JobRepository } from '../../../../shared/infrastructure/repositories/jobs/job-repository.js';
import { UpdateCombineCourseJob } from '../../../domain/models/UpdateCombinedCourseJob.js';

class UpdateCombinedCourseJobRepository extends JobRepository {
  constructor() {
    super({
      name: UpdateCombineCourseJob.name,
    });
  }
}

export const updateCombinedCourseJobRepository = new UpdateCombinedCourseJobRepository();
