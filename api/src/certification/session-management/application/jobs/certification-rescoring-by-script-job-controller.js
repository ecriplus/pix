import { JobController } from '../../../../shared/application/jobs/job-controller.js';
import { handlersAsServices } from '../../../../shared/domain/events/index.js';
import CertificationRescoredByScript from '../../domain/events/CertificationRescoredByScript.js';
import { CertificationRescoringByScriptJob } from '../../domain/models/CertificationRescoringByScriptJob.js';

class CertificationRescoringByScriptJobController extends JobController {
  constructor() {
    super(CertificationRescoringByScriptJob.name);
  }

  /**
   * @param {Object} data
   * @param {number} data.certificationCourseId
   */
  async handle({
    data,
    dependencies = {
      handlersAsServices,
    },
  }) {
    return dependencies.handlersAsServices.handleCertificationRescoring.handleCertificationRescoring(
      new CertificationRescoredByScript(data),
    );
  }
}

export { CertificationRescoringByScriptJobController };
