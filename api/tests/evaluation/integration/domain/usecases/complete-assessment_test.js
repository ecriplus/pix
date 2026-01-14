import { CertificationCompletedJob } from '../../../../../src/certification/evaluation/domain/events/CertificationCompleted.js';
import { certificationCompletedJobRepository } from '../../../../../src/certification/evaluation/infrastructure/repositories/jobs/certification-completed-job-repository.js';
import { completeAssessment } from '../../../../../src/evaluation/domain/usecases/complete-assessment.js';
import { Assessment } from '../../../../../src/shared/domain/models/Assessment.js';
import * as assessmentRepository from '../../../../../src/shared/infrastructure/repositories/assessment-repository.js';
import { databaseBuilder, expect, knex } from '../../../../test-helper.js';

describe('Integration | Usecase | Complete Assessment', function () {
  let userId, assessmentId;

  describe('#completeAssessment', function () {
    context('when assessment is linked to a certification course', function () {
      let sessionId;

      beforeEach(async function () {
        databaseBuilder.factory.buildSession({}).id;
        userId = databaseBuilder.factory.buildUser().id;

        databaseBuilder.factory.buildCertificationCandidate({
          sessionId,
          userId,
        }).id;

        const certificationCourse = databaseBuilder.factory.buildCertificationCourse({
          sessionId,
          userId,
        }).id;

        assessmentId = databaseBuilder.factory.buildAssessment({
          userId,
          certificationCourseId: certificationCourse.id,
          state: Assessment.states.STARTED,
          type: 'CERTIFICATION',
        }).id;

        return databaseBuilder.commit();
      });

      it('completes assessment and creates a CertificationCompletedJob', async function () {
        // when
        await completeAssessment({
          assessmentId,
          assessmentRepository,
          certificationCompletedJobRepository,
        });

        // then
        const assessmentInDb = await knex('assessments')
          .where('id', assessmentId)
          .first('state', 'updatedAt', 'createdAt');
        expect(assessmentInDb.state).to.equal(Assessment.states.COMPLETED);

        await expect(CertificationCompletedJob.name).to.have.been.performed.withJobsCount(1);
      });
    });
  });
});
