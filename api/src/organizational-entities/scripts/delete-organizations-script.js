import Joi from 'joi';

import { csvFileParser } from '../../shared/application/scripts/parsers.js';
import { Script } from '../../shared/application/scripts/script.js';
import { ScriptRunner } from '../../shared/application/scripts/script-runner.js';
import * as dataProtectionOfficerRepository from '../infrastructure/repositories/data-protection-officer.repository.js';
import { organizationForAdminRepository } from '../infrastructure/repositories/organization-for-admin.repository.js';
import * as organizationTagRepository from '../infrastructure/repositories/organization-tag.repository.js';

const columnsSchema = [{ name: 'Organization ID', schema: Joi.number().required() }];

export class DeleteOrganizationsScript extends Script {
  constructor() {
    super({
      description: 'Delete all organizations and associated tags',
      permanent: false,
      options: {
        file: {
          type: 'string',
          describe: 'File path to CSV file with organizations to delete',
          demandOption: true,
          requiresArg: true,
          coerce: csvFileParser(columnsSchema),
        },
        dryRun: {
          type: 'boolean',
          describe: 'Run the script without actually deleting anything',
          default: false,
        },
      },
    });
  }

  async handle({
    options,
    logger,
    dependencies = { organizationForAdminRepository, organizationTagRepository, dataProtectionOfficerRepository },
  }) {
    const { file, dryRun } = options;

    let count = 0;
    for (const row of file) {
      const organizationId = row['Organization ID'];
      if (!dryRun) {
        logger.info(organizationId);
        // Delete data protection officer via data-protection-officer.repository
        await dependencies.dataProtectionOfficerRepository.deleteDpoByOrganizationId(organizationId);
        // delete organization tags via organization-tags.repository
        await dependencies.organizationTagRepository.deleteTagsByOrganizationId(organizationId);
        // delete organizationvia organization-for-admin.repository
        await dependencies.organizationForAdminRepository.deleteById(organizationId);
      }
      count++;
    }

    if (dryRun) {
      logger.info(`Would delete ${count} organizations.`);
    } else {
      logger.info(`Deleted ${count} organizations.`);
    }
  }
}

await ScriptRunner.execute(import.meta.url, DeleteOrganizationsScript);
