import { knex } from '../../db/knex-database-connection.js';
import { AlgorithmEngineVersion } from '../../src/certification/shared/domain/models/AlgorithmEngineVersion.js';
import { isoDateParser } from '../../src/shared/application/scripts/parsers.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';

export class FixValidatedLiveAlertCertificationChallengeIds extends Script {
  constructor() {
    super({
      description: 'Fix certification-challenge-capacities from live alert misalignment',
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
          default: 100,
        },
        startingFromDate: {
          type: 'string',
          describe: 'scan certification-courses that happened after and __including__ the start date',
          demandOption: true,
          requiresArg: true,
          default: '2024-11-4',
          coerce: isoDateParser(),
        },
        stopAtDate: {
          type: 'string',
          describe: 'scan certification-courses that happened before and __excluding__ the stop date',
          demandOption: true,
          requiresArg: true,
          coerce: isoDateParser(),
        },
      },
    });

    this.totalNumberOfUpdatedRows = 0;
  }

  async handle({ options, logger }) {
    this.logger = logger;
    const dryRun = options.dryRun;
    const batchSize = options.batchSize;
    const delayInMs = options.delayBetweenBatch;
    const startingFromDate = options.startingFromDate;
    const stopAtDate = options.stopAtDate;

    this.logger.info({ dryRun, batchSize, delayInMs, startingFromDate, stopAtDate });

    if (startingFromDate > stopAtDate) {
      throw new Error('start date must be a date before the stop date');
    }

    let hasNext = true;
    let cursorId = 0;
    let currentCourseId;

    const errors = [];
    let courseIds;
    do {
      const transaction = await knex.transaction();
      try {
        courseIds = await this.#getCourseIds({
          cursorId,
          batchSize,
          startingFromDate,
          stopAtDate,
          transaction,
        });

        for (const currentCourse of courseIds) {
          currentCourseId = currentCourse.id;
          const results = await this.fixCertificationCapacities({ courseId: currentCourse.id, transaction });

          this.logger.debug({ results });

          this.totalNumberOfUpdatedRows += results.numberOfUpdates;
        }

        dryRun ? await transaction.rollback() : await transaction.commit();

        // Prepare for next batch
        hasNext = courseIds.length > 0;
        cursorId = courseIds.at(-1)?.id;
        await this.delay(delayInMs);
      } catch (error) {
        errors.push({ currentCourseId, error });
        cursorId = courseIds.at(-1)?.id;
      } finally {
        if (errors.length > 0) {
          this.logger.info({
            errors,
          });
          await transaction.rollback();
        } else {
          await transaction.commit();
        }
      }
    } while (hasNext);

    this.logger.info({
      totalNumberOfUpdatedRows: this.totalNumberOfUpdatedRows,
    });

    return 0;
  }

  async fixCertificationCapacities({ courseId, transaction }) {
    const allCertificationChallenges = await transaction
      .select({
        id: 'certification-challenges.id',
        challengeId: 'certification-challenges.challengeId',
      })
      .from('certification-challenges')
      .where('certification-challenges.courseId', '=', courseId)
      .orderBy('certification-challenges.createdAt', 'asc');

    // Find all capacities
    const certificationCapacities = await transaction
      .select({
        // table certif-challenges
        certifCourse_Id: 'certification-challenges.courseId',
        certifChallenge_Id: 'certification-challenges.id',
        certifChallenge_ChallengeId: 'certification-challenges.challengeId',
        // table answers
        answer_ChallengeId: 'answers.challengeId',
        // table capacities
        capacity_CertificationChallengeId: 'certification-challenge-capacities.certificationChallengeId',
        capacity_AnswerId: 'certification-challenge-capacities.answerId',
      })
      .from('certification-challenge-capacities')
      .innerJoin(
        'certification-challenges',
        'certification-challenge-capacities.certificationChallengeId',
        'certification-challenges.id',
      )
      .innerJoin('certification-courses', 'certification-challenges.courseId', 'certification-courses.id')
      .leftJoin('answers', 'certification-challenge-capacities.answerId', 'answers.id')
      .where('certification-challenges.courseId', '=', courseId)
      .orderBy('certification-challenges.createdAt', 'asc');

    this.logger.debug({ certificationCapacities });

    // Now fix capacities
    const capacitiesToUpdate = [];
    for (const currentCapacity of certificationCapacities) {
      this.logger.debug({ currentCapacity });
      if (currentCapacity.certifChallenge_ChallengeId !== currentCapacity.answer_ChallengeId) {
        // Copy capacity in error
        const capacityToModify = { ...currentCapacity };
        capacityToModify.capacity_CertificationChallengeId = 'REPLACE_ME';
        // Update also challengeId just to show we gound the right match in logs
        capacityToModify.certifChallenge_ChallengeId = 'REPLACE_ME';

        // Get the right challenge id for this capacity answer
        const indexOfCorrectChallenge = allCertificationChallenges.findIndex(
          (certifChallenge) => certifChallenge.challengeId === currentCapacity.answer_ChallengeId,
        );

        if (indexOfCorrectChallenge !== -1) {
          // Update capacity with right answer id
          capacityToModify.capacity_CertificationChallengeId =
            allCertificationChallenges.at(indexOfCorrectChallenge).id;
          // Update also certifChallengeChallengeId just to show we found the right match in logs
          capacityToModify.certifChallenge_ChallengeId =
            allCertificationChallenges.at(indexOfCorrectChallenge).challengeId;
          capacitiesToUpdate.push(capacityToModify);
        } else {
          // It is not possible that a capacity has a answer but no challenge
          throw new Error(`Capacity ${capacityToModify.capacity_AnswerId} do not have a corresponding challenge`);
        }

        // That answer cannot be used anymore
        allCertificationChallenges.splice(indexOfCorrectChallenge, 1);
      } else {
        // We are on a correct certif challenge, forget about her
        const correctChallenge = allCertificationChallenges.findIndex(
          (certifChallenge) => certifChallenge.id === currentCapacity.certifChallenge_Id,
        );
        // That certif challenge cannot be used anymore
        allCertificationChallenges.splice(correctChallenge, 1);
      }
    }

    // We have to do the update in reverse because certificationChallengeId is the PRIMARY KEY
    for (const capacityToUpdate of capacitiesToUpdate.reverse()) {
      await transaction('certification-challenge-capacities')
        .where('answerId', '=', capacityToUpdate.capacity_AnswerId)
        .update({
          certificationChallengeId: capacityToUpdate.capacity_CertificationChallengeId,
        });
    }

    this.logger.debug({ capacitiesToUpdate });

    return {
      numberOfUpdates: capacitiesToUpdate.length,
    };
  }

  #getCourseIds({ cursorId, batchSize, startingFromDate, stopAtDate, transaction }) {
    this.logger.debug({ cursorId, batchSize, startingFromDate, stopAtDate });
    return transaction
      .select('id')
      .from('certification-courses')
      .where('certification-courses.id', '>', cursorId)
      .andWhere('certification-courses.version', '=', AlgorithmEngineVersion.V3)
      .andWhere('certification-courses.createdAt', '>=', startingFromDate)
      .andWhere('certification-courses.createdAt', '<', stopAtDate)
      .orderBy('certification-courses.id')
      .limit(batchSize);
  }

  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

await ScriptRunner.execute(import.meta.url, FixValidatedLiveAlertCertificationChallengeIds);
