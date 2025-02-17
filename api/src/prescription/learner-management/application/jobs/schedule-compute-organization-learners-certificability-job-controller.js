import cronParser from 'cron-parser';
import dayjs from 'dayjs';

import { ComputeCertificabilityJob } from '../../../../prescription/learner-management/domain/models/ComputeCertificabilityJob.js';
import { JobScheduleController } from '../../../../shared/application/jobs/job-schedule-controller.js';
import { config } from '../../../../shared/config.js';
import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { JobExpireIn } from '../../../../shared/infrastructure/repositories/jobs/job-repository.js';
import * as organizationLearnerRepository from '../../../../shared/infrastructure/repositories/organization-learner-repository.js';
import { logger } from '../../../../shared/infrastructure/utils/logger.js';
import { computeCertificabilityJobRepository } from '../../../learner-management/infrastructure/repositories/jobs/compute-certificability-job-repository.js';
import { usecases } from '../../domain/usecases/index.js';

class ScheduleComputeOrganizationLearnersCertificabilityJobController extends JobScheduleController {
  constructor() {
    super('ScheduleComputeOrganizationLearnersCertificabilityJob', {
      jobCron: config.features.scheduleComputeOrganizationLearnersCertificability.cron,
      expireIn: JobExpireIn.FOUR_HOURS,
    });
  }

  get legacyName() {
    return 'ComputeOrganizationLearnersCertificabilityJob';
  }

  async handle({
    data = {},
    dependencies = { organizationLearnerRepository, computeCertificabilityJobRepository, config, logger },
  }) {
    const skipLoggedLastDayCheck = data?.skipLoggedLastDayCheck;
    const onlyNotComputed = data?.onlyNotComputed;
    const {
      chunkSize,
      cron: cronConfig,
      synchronously,
    } = dependencies.config.features.scheduleComputeOrganizationLearnersCertificability;

    const isolationLevel = 'repeatable read';

    const parsedCron = cronParser.parseExpression(cronConfig, { tz: 'Europe/Paris' });
    const toUserActivityDate = parsedCron.prev().toDate();

    const fromUserActivityDate = dayjs(toUserActivityDate).subtract(1, 'day').toDate();

    return await DomainTransaction.execute(
      async () => {
        const count =
          await dependencies.organizationLearnerRepository.countByOrganizationsWhichNeedToComputeCertificability({
            skipLoggedLastDayCheck,
            fromUserActivityDate,
            toUserActivityDate,
            onlyNotComputed,
          });

        const chunkCount = Math.ceil(count / chunkSize);
        dependencies.logger.info(
          `ScheduleComputeOrganizationLearnersCertificabilityJobHandler - Total learners to compute : ${count}`,
        );

        let totalJobsInserted = 0;

        for (let index = 0; index < chunkCount; index++) {
          const offset = index * chunkSize;
          dependencies.logger.info(`ScheduleComputeOrganizationLearnersCertificabilityJobHandler - Offset : ${offset}`);

          const organizationLearnerIds =
            await dependencies.organizationLearnerRepository.findByOrganizationsWhichNeedToComputeCertificability({
              limit: chunkSize,
              offset,
              fromUserActivityDate,
              toUserActivityDate,
              skipLoggedLastDayCheck,
              onlyNotComputed,
            });

          dependencies.logger.info(
            `ScheduleComputeOrganizationLearnersCertificabilityJobHandler - Ids count  : ${organizationLearnerIds.length}`,
          );

          if (synchronously) {
            for (const organizationLearnerId of organizationLearnerIds) {
              await usecases.computeOrganizationLearnerCertificability({ organizationLearnerId });
            }

            dependencies.logger.info(
              `ScheduleComputeOrganizationLearnersCertificabilityJobHandler - Certificability computed count : ${organizationLearnerIds.length}`,
            );
            continue;
          }

          const jobsToInsert = organizationLearnerIds.map(
            (organizationLearnerId) => new ComputeCertificabilityJob({ organizationLearnerId }),
          );

          const jobsInserted = await dependencies.computeCertificabilityJobRepository.performAsync(...jobsToInsert);
          totalJobsInserted += jobsInserted.rowCount;

          dependencies.logger.info(
            `ScheduleComputeOrganizationLearnersCertificabilityJobHandler - Jobs inserted count  : ${jobsInserted.rowCount}`,
          );
        }

        if (synchronously) {
          dependencies.logger.info(
            `ScheduleComputeOrganizationLearnersCertificabilityJobHandler - Total certificability computed count : ${totalJobsInserted}`,
          );

          return;
        }
        dependencies.logger.info(
          `ScheduleComputeOrganizationLearnersCertificabilityJobHandler - Total jobs inserted count : ${totalJobsInserted}`,
        );
      },
      { isolationLevel },
    );
  }
}

export { ScheduleComputeOrganizationLearnersCertificabilityJobController };
