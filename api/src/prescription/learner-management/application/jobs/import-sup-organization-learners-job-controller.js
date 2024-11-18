import { JobController } from '../../../../shared/application/jobs/job-controller.js';
import { config } from '../../../../shared/config.js';
import { DomainError } from '../../../../shared/domain/errors.js';
import { getI18n } from '../../../../shared/infrastructure/i18n/i18n.js';
import { logger as l } from '../../../../shared/infrastructure/utils/logger.js';
import { ImportSupOrganizationLearnersJob } from '../../domain/models/ImportSupOrganizationLearnersJob.js';
import { usecases } from '../../domain/usecases/index.js';

class ImportSupOrganizationLearnersJobController extends JobController {
  #logger;

  constructor({ logger = l } = {}) {
    super(ImportSupOrganizationLearnersJob.name);
    this.#logger = logger;
  }

  get isJobEnabled() {
    return config.pgBoss.importFileJobEnabled;
  }

  async handle({ data }) {
    const { organizationImportId, locale } = data;

    try {
      return await await usecases.importSupOrganizationLearners({
        organizationImportId,
        i18n: getI18n(locale),
      });
    } catch (err) {
      if (!(err instanceof DomainError)) {
        throw err;
      }
      this.#logger.error(err);
    }
  }
}

export { ImportSupOrganizationLearnersJobController };
