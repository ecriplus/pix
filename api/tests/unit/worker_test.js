import { Metrics } from '../../src/monitoring/infrastructure/metrics.js';
import { ScheduleComputeOrganizationLearnersCertificabilityJobController } from '../../src/prescription/learner-management/application/jobs/schedule-compute-organization-learners-certificability-job-controller.js';
import { ValidateOrganizationLearnersImportFileJobController } from '../../src/prescription/learner-management/application/jobs/validate-organization-learners-import-file-job-controller.js';
import { ValidateOrganizationImportFileJob } from '../../src/prescription/learner-management/domain/models/ValidateOrganizationImportFileJob.js';
import { EventLoggingJobController } from '../../src/shared/application/jobs/event-logging.job-controller.js';
import { JobGroup } from '../../src/shared/application/jobs/job-controller.js';
import { config } from '../../src/shared/config.js';
import { EventLoggingJob } from '../../src/shared/domain/models/jobs/EventLoggingJob.js';
import { JobExpireIn } from '../../src/shared/infrastructure/repositories/jobs/job-repository.js';
import { registerJobs, startPgBoss } from '../../worker.js';
import { catchErr, expect, sinon } from '../test-helper.js';

describe('Unit | Worker', function () {
  context('#registerJobs', function () {
    let startPgBossStub, createJobQueueStub, jobQueueStub;

    beforeEach(function () {
      const pgBossStub = Symbol('pgBoss');
      jobQueueStub = { register: sinon.stub(), scheduleCronJob: sinon.stub(), unscheduleCronJob: sinon.stub() };
      startPgBossStub = sinon.stub();
      startPgBossStub.resolves(pgBossStub);
      createJobQueueStub = sinon.stub();
      createJobQueueStub.withArgs(pgBossStub).returns(jobQueueStub);
    });

    afterEach(function () {
      sinon.restore();
    });

    it('should register EventLoggingJob', async function () {
      // when
      await registerJobs({
        jobGroups: [JobGroup.DEFAULT],
        dependencies: {
          startPgBoss: startPgBossStub,
          createJobQueue: createJobQueueStub,
        },
      });

      // then
      expect(jobQueueStub.register).to.have.been.calledWithExactly(
        new Metrics({ config: { metrics: { isDirectMetricsEnabled: false } } }),
        EventLoggingJob.name,
        EventLoggingJobController,
      );
    });

    it('should register legacyName from EventLoggingJob', async function () {
      // when
      sinon.stub(EventLoggingJobController.prototype, 'legacyName').get(() => 'legacyNameForEventLoggingJobController');
      await registerJobs({
        jobGroups: [JobGroup.DEFAULT],
        dependencies: {
          startPgBoss: startPgBossStub,
          createJobQueue: createJobQueueStub,
        },
      });

      // then
      expect(jobQueueStub.register).to.have.been.calledWithExactly(
        new Metrics({ config: { metrics: { isDirectMetricsEnabled: false } } }),
        'legacyNameForEventLoggingJobController',
        EventLoggingJobController,
      );
    });

    it('should register ValidateOrganizationImportFileJob when job is enabled', async function () {
      //given
      sinon.stub(config.pgBoss, 'validationFileJobEnabled').value(true);

      // when
      await registerJobs({
        jobGroups: [JobGroup.DEFAULT],
        dependencies: {
          startPgBoss: startPgBossStub,
          createJobQueue: createJobQueueStub,
        },
      });

      // then
      expect(jobQueueStub.register).to.have.been.calledWithExactly(
        new Metrics({ config: { metrics: { isDirectMetricsEnabled: false } } }),
        ValidateOrganizationImportFileJob.name,
        ValidateOrganizationLearnersImportFileJobController,
      );
    });

    it('should not register ValidateOrganizationImportFileJob when job is disabled', async function () {
      //given
      sinon.stub(config.pgBoss, 'validationFileJobEnabled').value(false);

      // when
      await registerJobs({
        jobGroups: [JobGroup.DEFAULT],
        dependencies: {
          startPgBoss: startPgBossStub,
          createJobQueue: createJobQueueStub,
        },
      });

      // then
      expect(jobQueueStub.register).to.not.have.been.calledWithExactly(
        ValidateOrganizationImportFileJob.name,
        ValidateOrganizationLearnersImportFileJobController,
      );
    });

    it('should not register jobs when pgboss is null', async function () {
      //given
      startPgBossStub.resolves(null);

      // when
      await registerJobs({
        jobGroups: [JobGroup.DEFAULT],
        dependencies: {
          startPgBoss: startPgBossStub,
          createJobQueue: createJobQueueStub,
        },
      });

      // then
      expect(createJobQueueStub).to.not.have.been.called;
      expect(jobQueueStub.register).to.not.have.been.called;
      expect(jobQueueStub.scheduleCronJob).to.not.have.been.called;
    });

    it('should throws an error when no groups is invalid', async function () {
      // given
      const error = await catchErr(registerJobs)({
        dependencies: {
          startPgBoss: startPgBossStub,
          createJobQueue: createJobQueueStub,
        },
      });

      // then
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.equal('Job groups are mandatory');
    });

    it('should throws an error when group is invalid', async function () {
      // given
      const error = await catchErr(registerJobs)({
        jobGroups: ['pouet'],
        dependencies: {
          startPgBoss: startPgBossStub,
          createJobQueue: createJobQueueStub,
        },
      });

      // then
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.equal(`Job group invalid, allowed Job groups are [${Object.values(JobGroup)}]`);
    });

    describe('cron Job', function () {
      it('schedule ScheduleComputeOrganizationLearnersCertificabilityJob', async function () {
        //given
        sinon.stub(config.features.scheduleComputeOrganizationLearnersCertificability, 'cron').value('0 21 * * *');

        await registerJobs({
          jobGroups: [JobGroup.DEFAULT],
          dependencies: {
            startPgBoss: startPgBossStub,
            createJobQueue: createJobQueueStub,
          },
        });

        // then
        expect(jobQueueStub.scheduleCronJob).to.have.been.calledWithExactly({
          name: 'ScheduleComputeOrganizationLearnersCertificabilityJob',
          cron: '0 21 * * *',
          options: { tz: 'Europe/Paris', expireIn: JobExpireIn.INFINITE },
        });
      });

      it('unschedule legacyName from ScheduleComputeOrganizationLearnersCertificabilityJob', async function () {
        //given
        sinon
          .stub(ScheduleComputeOrganizationLearnersCertificabilityJobController.prototype, 'legacyName')
          .get(() => 'legyNameForScheduleComputeOrganizationLearnersCertificabilityJobController');

        sinon.stub(config.features.scheduleComputeOrganizationLearnersCertificability, 'cron').value('0 21 * * *');

        await registerJobs({
          jobGroups: [JobGroup.DEFAULT],
          dependencies: {
            startPgBoss: startPgBossStub,
            createJobQueue: createJobQueueStub,
          },
        });

        // then
        expect(jobQueueStub.unscheduleCronJob).to.have.been.calledWithExactly(
          'legyNameForScheduleComputeOrganizationLearnersCertificabilityJobController',
        );
      });

      context('when a cron job is disabled', function () {
        it('unschedule the job', async function () {
          //given
          sinon.stub(config.cpf.sendEmailJob, 'cron').value('0 21 * * *');
          sinon.stub(config.pgBoss, 'exportSenderJobEnabled').value(false);

          await registerJobs({
            jobGroups: [JobGroup.DEFAULT],
            dependencies: {
              startPgBoss: startPgBossStub,
              createJobQueue: createJobQueueStub,
            },
          });

          // then
          expect(jobQueueStub.unscheduleCronJob).to.have.been.calledWithExactly('CpfExportSenderJob');
        });
      });
    });
  });

  context('#startPgBoss', function () {
    it('should return null when pgboss connexionPoolMaxSize is 0', async function () {
      //given
      sinon.stub(config.pgBoss, 'connexionPoolMaxSize').value(0);

      //when
      const pgboss = await startPgBoss();

      //then
      expect(pgboss).to.be.null;
    });
  });
});
