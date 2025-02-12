import 'dotenv/config';

import { knex } from '../../db/knex-database-connection.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';

export class FixDuplicatedChallengeScript extends Script {
  constructor() {
    super({
      description: 'Fix certification-challenge-capacities from exact same challenge recorded twice',
      permanent: false,
      options: {
        courseIds: {
          type: 'array',
          describe: 'List of certification course to fix',
          demandOption: true,
          default: [],
        },
        dryRun: {
          type: 'boolean',
          describe: 'Commit the UPDATE or not',
          demandOption: false,
          default: true,
        },
      },
    });

    this.totalNumberOfUpdatedRows = 0;
    this.totalNumberOfDeletedRows = 0;
  }

  async handle({ options, logger }) {
    this.logger = logger;
    const dryRun = options.dryRun;
    const courseIds = options.courseIds;
    this.logger.info(`dryRun=${dryRun} courseIds=[${courseIds}]`);

    for (const currentCourse of courseIds) {
      const results = await this.fixCertificationCapacities({ dryRun, courseId: currentCourse });

      this.logger.debug({ results });

      this.totalNumberOfUpdatedRows += results.numberOfUpdates;
      this.totalNumberOfDeletedRows += results.numberOfDeletes;
    }

    this.logger.info({
      totalNumberOfCertifications: courseIds.length,
      totalNumberOfUpdatedRows: this.totalNumberOfUpdatedRows,
      totalNumberOfDeletedRows: this.totalNumberOfDeletedRows,
    });

    return 0;
  }

  async fixCertificationCapacities({ dryRun, courseId }) {
    const transaction = await knex.transaction();
    try {
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

      // Now from all remaining challenges, find the ones that HAVE a capacity already (meaning they are a duplicate)
      const certifChallengesToDelete = allCertificationChallenges.filter((challenge) =>
        certificationCapacities.find((capacity) => capacity.certifChallenge_Id === challenge.id),
      );

      // We have to do the update in reverse because certificationChallengeId is the PRIMARY KEY
      for (const capacityToUpdate of capacitiesToUpdate.reverse()) {
        await transaction('certification-challenge-capacities')
          .where('answerId', '=', capacityToUpdate.capacity_AnswerId)
          .update({
            certificationChallengeId: capacityToUpdate.capacity_CertificationChallengeId,
          });
      }

      await transaction('certification-challenges')
        .whereIn(
          'id',
          certifChallengesToDelete.map((challenge) => challenge.id),
        )
        .delete();

      this.logger.debug({ capacitiesToUpdate });
      this.logger.debug({ certifChallengesToDelete });

      dryRun ? await transaction.rollback() : await transaction.commit();

      return {
        numberOfUpdates: capacitiesToUpdate.length,
        numberOfDeletes: certifChallengesToDelete.length,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

await ScriptRunner.execute(import.meta.url, FixDuplicatedChallengeScript);
