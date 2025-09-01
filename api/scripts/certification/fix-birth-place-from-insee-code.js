import { knex } from '../../db/knex-database-connection.js';
import * as certificationCpfCityRepository from '../../src/certification/enrolment/infrastructure/repositories/certification-cpf-city-repository.js';
import * as certificationCpfCountryRepository from '../../src/certification/enrolment/infrastructure/repositories/certification-cpf-country-repository.js';
// import { CERTIFICATION_CANDIDATES_ERRORS } from '../../src/certification/shared/domain/constants/certification-candidates-errors.js';
import { getBirthInformation } from '../../src/certification/shared/domain/services/certification-cpf-service.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';

const excludedINSEECode = '99999';

export class FixBirthPlaceFromInseeCode extends Script {
  constructor() {
    super({
      description: 'Fix missing birth places from INSEE code',
      permanent: false,
      options: {
        dryRun: {
          type: 'boolean',
          describe: 'Commit the UPDATE or not',
          demandOption: true,
        },
        batchSize: {
          type: 'number',
          describe: 'Number of rows to update at once',
          demandOption: false,
          default: 1000,
        },
        delayBetweenBatch: {
          type: 'number',
          describe: 'In ms, force a pause between COMMIT',
          demandOption: false,
          default: 1000,
        },
      },
    });
  }

  async handle({ options, logger }) {
    this.logger = logger;
    const dryRun = options.dryRun;
    const batchSize = options.batchSize;
    const delayInMs = options.delayBetweenBatch;

    this.logger.info({ dryRun, batchSize, delayInMs });

    let hasNext = true;
    let cursorId = 0;

    do {
      const transaction = await knex.transaction();
      try {
        const candidatesWithoutBirthCity = await this.#getCandidatesToUpdate({ cursorId, batchSize, transaction });

        for (const candidate of candidatesWithoutBirthCity) {
          const birthInformation = await getBirthInformation({
            birthCountry: candidate.birthCountry,
            birthINSEECode: candidate.birthINSEECode,
            birthCity: null,
            birthPostalCode: null,
            certificationCpfCountryRepository,
            certificationCpfCityRepository,
          });

          const birthCity = birthInformation.birthCity;

          if (birthInformation.errors.length === 0) {
            await transaction('certification-candidates').update({ birthCity }).where({ id: candidate.id });
          } else {
            this.logger.warn({ errors: birthInformation.errors });
          }
        }

        if (dryRun) {
          this.logger.info('Rollback !');
          await transaction.rollback();
        } else {
          this.logger.info('Commit !');
          await transaction.commit();
        }
        // Prepare for next batch
        hasNext = candidatesWithoutBirthCity.length > 0;
        cursorId = candidatesWithoutBirthCity.at(-1)?.id;
        await this.delay(delayInMs);
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } while (hasNext);
  }

  #getCandidatesToUpdate({ cursorId, batchSize, transaction }) {
    this.logger.debug({ cursorId, batchSize });
    return transaction
      .select(['id', 'birthCountry', 'birthINSEECode'])
      .from('certification-candidates')
      .whereNull('birthCity')
      .whereNotNull('birthINSEECode')
      .whereNotNull('birthCountry')
      .where('birthINSEECode', '<>', excludedINSEECode)
      .where('id', '>', cursorId)
      .orderBy('id')
      .limit(batchSize);
  }

  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

await ScriptRunner.execute(import.meta.url, FixBirthPlaceFromInseeCode);
