import { JobController } from '../../../../shared/application/jobs/job-controller.js';
import { config } from '../../../../shared/config.js';
import { DomainError } from '../../../../shared/domain/errors.js';
import { getI18n } from '../../../../shared/infrastructure/i18n/i18n.js';
import { logger as l } from '../../../../shared/infrastructure/utils/logger.js';
import { ValidateCsvOrganizationImportFileJob } from '../../domain/models/ValidateCsvOrganizationImportFileJob.js';
import { usecases } from '../../domain/usecases/index.js';
import { OrganizationLearnerParser } from '../../infrastructure/serializers/csv/organization-learner-parser.js';
import { SupOrganizationLearnerParser } from '../../infrastructure/serializers/csv/sup-organization-learner-parser.js';

class ValidateCsvOrganizationLearnersImportFileJobController extends JobController {
  #logger;

  constructor({ logger = l } = {}) {
    super(ValidateCsvOrganizationImportFileJob.name);
    this.#logger = logger;
  }

  get isJobEnabled() {
    return config.pgBoss.validationFileJobEnabled;
  }

  async handle({ data }) {
    const { organizationImportId, locale, type } = data;

    const Parser = type !== 'FREGATA' ? SupOrganizationLearnerParser : OrganizationLearnerParser;
    const i18n = getI18n(locale);

    try {
      await usecases.validateCsvFile({ organizationImportId, i18n, type, Parser });
    } catch (err) {
      if (!(err instanceof DomainError)) {
        throw err;
      }
      this.#logger.warn(err);
    }
  }
}

export { ValidateCsvOrganizationLearnersImportFileJobController };
