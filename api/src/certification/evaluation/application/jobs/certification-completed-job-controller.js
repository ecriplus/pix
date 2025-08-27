import { JobController } from '../../../../shared/application/jobs/job-controller.js';
import { CertificationCompletedJob } from '../../domain/events/CertificationCompleted.js';
import { usecases } from '../../domain/usecases/index.js';

export class CertificationCompletedJobController extends JobController {
  constructor() {
    super(CertificationCompletedJob.name);
  }

  async handle({ data }) {
    const { assessmentId, locale } = data;
    await usecases.scoreCompletedCertification({ assessmentId, locale });
  }
}
