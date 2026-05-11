import { JobController } from '../../../../../shared/application/jobs/job-controller.js';
import { config } from '../../../../../shared/config.js';
import { DomainError } from '../../../../../shared/domain/errors.js';
import { logger as l } from '../../../../../shared/infrastructure/utils/logger.js';
import { ImportFromSiecleJob } from '../../../domain/models/jobs/ImportFromSiecleJob.js';
import { usecases } from '../../../domain/usecases/index.js';

class ImportFromSiecleJobController extends JobController {
  #logger;

  constructor({ logger = l } = {}) {
    super(ImportFromSiecleJob.name);
    this.#logger = logger;
  }

  get isJobEnabled() {
    return config.pgBoss.importFileJobEnabled;
  }

  async handle({ data }) {
    const { organizationImportId } = data;

    try {
      return await usecases.addOrUpdateOrganizationLearners({ organizationImportId });
    } catch (err) {
      if (!(err instanceof DomainError)) {
        throw err;
      }
      this.#logger.error(err);
    }
  }
}

export { ImportFromSiecleJobController };
