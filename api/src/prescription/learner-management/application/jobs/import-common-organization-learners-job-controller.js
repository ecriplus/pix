import { JobController } from '../../../../shared/application/jobs/job-controller.js';
import { config } from '../../../../shared/config.js';
import { DomainError } from '../../../../shared/domain/errors.js';
import { logger as l } from '../../../../shared/infrastructure/utils/logger.js';
import { ImportCommonOrganizationLearnersJob } from '../../domain/models/ImportCommonOrganizationLearnersJob.js';
import { usecases } from '../../domain/usecases/index.js';

class ImportCommonOrganizationLearnersJobController extends JobController {
  #logger;

  constructor({ logger = l } = {}) {
    super(ImportCommonOrganizationLearnersJob.name);
    this.#logger = logger;
  }

  get isJobEnabled() {
    return config.pgBoss.importFileJobEnabled;
  }

  async handle({ data }) {
    const { organizationImportId } = data;

    try {
      return await usecases.saveOrganizationLearnersFile({ organizationImportId });
    } catch (err) {
      if (!(err instanceof DomainError)) {
        throw err;
      }
      this.#logger.error(err);
    }
  }
}

export { ImportCommonOrganizationLearnersJobController };
