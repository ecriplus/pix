import { setTimeout } from 'node:timers/promises';

import { DomainTransaction } from '../../../src/shared/domain/DomainTransaction.js';
import { Script } from '../../shared/application/scripts/script.js';
import { ScriptRunner } from '../../shared/application/scripts/script-runner.js';
import { LegalDocumentService } from '../domain/models/LegalDocumentService.js';
import { LegalDocumentType } from '../domain/models/LegalDocumentType.js';
import * as legalDocumentRepository from '../infrastructure/repositories/legal-document.repository.js';

const { TOS } = LegalDocumentType.VALUES;
const { PIX_ORGA } = LegalDocumentService.VALUES;

const DEFAULT_BATCH_SIZE = 1000;
const DEFAULT_THROTTLE_DELAY = 300;

export class ConvertUsersOrgaCguData extends Script {
  constructor() {
    super({
      description: 'Converts users orga CGU data to legal-document-versions-user-acceptances',
      permanent: false,
      options: {
        dryRun: {
          type: 'boolean',
          describe: 'Executes the script in dry run mode',
          default: false,
        },
        batchSize: {
          type: 'number',
          describe: 'Size of the batch to process',
          default: DEFAULT_BATCH_SIZE,
        },
        throttleDelay: {
          type: 'number',
          describe: 'Delay between batches in milliseconds',
          default: DEFAULT_THROTTLE_DELAY,
        },
      },
    });
  }

  async handle({ options, logger }) {
    const { dryRun, batchSize, throttleDelay } = options;

    const legalDocument = await legalDocumentRepository.findLastVersionByTypeAndService({
      type: TOS,
      service: PIX_ORGA,
    });

    if (!legalDocument) {
      throw new Error(`No legal document found for type: ${TOS}, service: ${PIX_ORGA}`);
    }

    let offset = 0;
    let migrationCount = 0;

    const run = true;
    while (run) {
      const usersWithCgu = await this.#findOrgaCguAcceptedUsers({ batchSize, offset });

      if (usersWithCgu.length === 0) {
        break;
      }

      logger.info(`Batch #${Math.ceil(offset / batchSize + 1)}`);

      const usersToMigrate = await this.#filterAlreadyMigratedUsers({ legalDocument, users: usersWithCgu });

      if (!dryRun) {
        await this.#createNewLegalDocumentAcceptanceForUsersBatch({ legalDocument, users: usersToMigrate });
      }

      migrationCount += usersToMigrate.length;
      offset += usersWithCgu.length;

      await setTimeout(throttleDelay);
    }

    logger.info(`Total users ${dryRun ? 'to migrate' : 'migrated'}: ${migrationCount}`);
  }

  async #findOrgaCguAcceptedUsers({ batchSize, offset }) {
    const knexConnection = DomainTransaction.getConnection();

    return knexConnection('users')
      .select('*')
      .where('pixOrgaTermsOfServiceAccepted', true)
      .orderBy('id')
      .limit(batchSize)
      .offset(offset);
  }

  async #filterAlreadyMigratedUsers({ legalDocument, users }) {
    const knexConnection = DomainTransaction.getConnection();

    const alreadyMigratedUsers = await knexConnection('legal-document-version-user-acceptances')
      .select('userId')
      .where('legalDocumentVersionId', legalDocument.id)
      .whereIn(
        'userId',
        users.map((user) => user.id),
      );

    const alreadyMigratedIds = alreadyMigratedUsers.map((user) => user.userId);
    return users.filter((user) => !alreadyMigratedIds.includes(user.id));
  }

  async #createNewLegalDocumentAcceptanceForUsersBatch({ legalDocument, users }) {
    const knexConnection = DomainTransaction.getConnection();

    const chunkSize = 100;
    const rows = users.map((user) => ({
      userId: user.id,
      legalDocumentVersionId: legalDocument.id,
      acceptedAt: user.lastPixOrgaTermsOfServiceValidatedAt || new Date(),
    }));

    await knexConnection.batchInsert('legal-document-version-user-acceptances', rows, chunkSize);
  }
}

await ScriptRunner.execute(import.meta.url, ConvertUsersOrgaCguData);
