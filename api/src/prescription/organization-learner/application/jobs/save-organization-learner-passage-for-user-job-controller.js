import { JobController } from '../../../../shared/application/jobs/job-controller.js';
import { SaveOrganizationLearnerPassageForUserJob } from '../../domain/models/SaveOrganizationLearnerPassageForUserJob.js';

class SaveOrganizationLearnerPassageJobController extends JobController {
  constructor() {
    super(SaveOrganizationLearnerPassageForUserJob.name);
  }
  async handle({ data }) {
    const { userId, moduleId } = data;

    // eslint-disable-next-line no-console
    console.log(`Saving passage for user ${userId} and module ${moduleId}`);
  }
}

export { SaveOrganizationLearnerPassageJobController };
