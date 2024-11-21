import { JobController } from '../../../../shared/application/jobs/job-controller.js';
import { config } from '../../../../shared/config.js';
import { DomainError } from '../../../../shared/domain/errors.js';
import { getI18n } from '../../../../shared/infrastructure/i18n/i18n.js';
import { logger as l } from '../../../../shared/infrastructure/utils/logger.js';
import { ImportScoCsvOrganizationLearnersJob } from '../../domain/models/ImportScoCsvOrganizationLearnersJob.js';
import { usecases } from '../../domain/usecases/index.js';

class ImportScoCsvOrganizationLearnersJobController extends JobController {
  #logger;

  constructor({ logger = l } = {}) {
    super(ImportScoCsvOrganizationLearnersJob.name);
    this.#logger = logger;
  }

  get isJobEnabled() {
    return config.pgBoss.importFileJobEnabled;
  }

  async handle({ data }) {
    const { organizationImportId, locale } = data;
    const i18n = getI18n(locale);

    try {
      await usecases.importOrganizationLearnersFromSIECLECSVFormat({
        organizationImportId,
        i18n,
      });
    } catch (err) {
      if (!(err instanceof DomainError)) {
        throw err;
      }
      this.#logger.error(err);
    }
  }
}

export { ImportScoCsvOrganizationLearnersJobController };
