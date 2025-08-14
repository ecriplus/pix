import joi from 'joi';

import { knex } from '../../../db/knex-database-connection.js';
import { csvFileStreamer } from '../../shared/application/scripts/parsers.js';
import { Script } from '../../shared/application/scripts/script.js';
import { ScriptRunner } from '../../shared/application/scripts/script-runner.js';

const DEFAULT_BATCH_SIZE = 1000;
const DEFAULT_DELAY_MS = 1000;

const columnSchemas = [
  { name: 'userId', schema: joi.number().required() },
  { name: 'locale', schema: joi.string().required() },
];

export class FillUsersLocaleFromCsvScript extends Script {
  constructor() {
    super({
      description: 'Update users.locale from a CSV (userId, locale) if locale is null.',
      permanent: false,
      options: {
        file: {
          type: 'string',
          describe: 'CSV file path to process',
          demandOption: true,
          coerce: csvFileStreamer(columnSchemas),
        },
        dryRun: {
          type: 'boolean',
          describe: 'If present, does not modify the database',
          default: false,
        },
        batchSize: {
          type: 'number',
          describe: 'Number of users to process per batch',
          default: DEFAULT_BATCH_SIZE,
        },
        delayInMilliseconds: {
          type: 'number',
          describe: 'Delay between each batch in ms',
          default: DEFAULT_DELAY_MS,
        },
      },
    });
  }

  async handle({ options, logger }) {
    const { file: streamFile, dryRun, batchSize, delayInMilliseconds } = options;
    let totalUsersProcessed = 0;
    let totalUsersUpdated = 0;
    let totalUsersSkipped = 0;
    let batchIndex = 0;

    await streamFile(async (userRows) => {
      batchIndex++;
      logger.info(`Batch ${batchIndex}: ${userRows.length} users`);
      await _delay(delayInMilliseconds);

      const usersToUpdate = await _getUsersToUpdateFromBatch(userRows);

      const batchSkipped = userRows.length - usersToUpdate.length;

      const userUpdatedCount = await _updateUsersByLocale({ usersToUpdate, dryRun });
      totalUsersUpdated += userUpdatedCount;
      totalUsersProcessed += userRows.length;
      totalUsersSkipped += batchSkipped;

      logger.info(`${userUpdatedCount} users updated in this batch.`);
      if (batchSkipped > 0) {
        logger.info(`${batchSkipped} users already have a locale and will not be processed in this batch.`);
      }
    }, batchSize);

    logger.info(`${totalUsersProcessed} users processed. ${totalUsersUpdated} updated.`);
    if (totalUsersSkipped > 0) {
      logger.info(`${totalUsersSkipped} users already had a locale and were not processed.`);
    }
  }
}

await ScriptRunner.execute(import.meta.url, FillUsersLocaleFromCsvScript);

async function _delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function _fetchUseridsWithoutLocale(userIds) {
  const rows = await knex('users').select('id').whereIn('id', userIds).whereNull('locale');
  return rows.map((row) => row.id);
}

async function _getUsersToUpdateFromBatch(userRows) {
  const normalizedRows = userRows.map((row) => ({ ...row, userId: Number(row.userId) }));
  const userIds = normalizedRows.map((row) => row.userId);
  const userIdsWithoutLocale = await _fetchUseridsWithoutLocale(userIds);
  return normalizedRows.filter((row) => userIdsWithoutLocale.includes(row.userId));
}

function _groupUserIdsByLocale(users) {
  const userIdsByLocale = {};
  for (const user of users) {
    const { locale, userId } = user;
    if (!userIdsByLocale[locale]) {
      userIdsByLocale[locale] = [];
    }
    userIdsByLocale[locale].push(userId);
  }
  return userIdsByLocale;
}

async function _updateUsersByLocale({ usersToUpdate, dryRun }) {
  const userIdsByLocale = _groupUserIdsByLocale(usersToUpdate);

  let totalUpdated = 0;
  for (const [locale, userIds] of Object.entries(userIdsByLocale)) {
    if (!dryRun) {
      await knex('users').whereIn('id', userIds).update({ locale });
    }
    totalUpdated += userIds.length;
  }
  return totalUpdated;
}
