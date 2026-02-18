import _ from 'lodash';

import { CertificationCompletedJob } from '../../../../../src/certification/evaluation/domain/events/CertificationCompleted.js';
import { AlreadyRatedAssessmentError } from '../../../../../src/evaluation/domain/errors.js';
import { completeAssessment } from '../../../../../src/evaluation/domain/usecases/complete-assessment.js';
import { Assessment } from '../../../../../src/shared/domain/models/Assessment.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../test-helper.js';

describe('Unit | UseCase | complete-assessment', function () {
  let assessmentRepository;
  let certificationCompletedJobRepository;
  const now = new Date('2019-01-01T05:06:07Z');
  let clock;

  beforeEach(function () {
    assessmentRepository = {
      get: _.noop,
      completeByAssessmentId: _.noop,
    };

    certificationCompletedJobRepository = {
      performAsync: _.noop,
    };

    clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
  });

  afterEach(function () {
    clock.restore();
  });

  context('when assessment is already completed', function () {
    const assessmentId = 'assessmentId';

    beforeEach(function () {
      const completedAssessment = domainBuilder.buildAssessment({
        id: assessmentId,
        state: 'completed',
      });
      sinon.stub(assessmentRepository, 'get').withArgs(assessmentId).resolves(completedAssessment);
    });

    it('should return an AlreadyRatedAssessmentError', async function () {
      // when
      const err = await catchErr(completeAssessment)({
        assessmentId,
        assessmentRepository,
      });

      // then
      expect(err).to.be.an.instanceof(AlreadyRatedAssessmentError);
    });
  });

  context('when assessment is not yet completed', function () {
    [_buildCompetenceEvaluationAssessment(), _buildCampaignAssessment(), _buildCertificationAssessment()].forEach(
      (assessment) => {
        context(`common behavior when assessment is of type ${assessment.type}`, function () {
          beforeEach(function () {
            sinon.stub(assessmentRepository, 'get').withArgs(assessment.id).resolves(assessment);
            sinon.stub(assessmentRepository, 'completeByAssessmentId').resolves();
            sinon.stub(certificationCompletedJobRepository, 'performAsync').resolves();
          });

          it('should complete the assessment', async function () {
            // when
            await completeAssessment({
              assessmentId: assessment.id,
              assessmentRepository,
              certificationCompletedJobRepository,
            });

            // then
            expect(assessmentRepository.completeByAssessmentId.calledWithExactly(assessment.id)).to.be.true;
          });
        });
      },
    );

    context('when assessment is of type CERTIFICATION', function () {
      it('should trigger the certification completed job', async function () {
        const assessment = _buildCertificationAssessment();

        sinon.stub(assessmentRepository, 'get').withArgs(assessment.id).resolves(assessment);
        sinon.stub(assessmentRepository, 'completeByAssessmentId').resolves();
        sinon
          .stub(certificationCompletedJobRepository, 'performAsync')
          .withArgs(
            new CertificationCompletedJob({
              certificationCourseId: assessment.certificationCourseId,
            }),
          )
          .resolves();
        // when
        await completeAssessment({
          assessmentId: assessment.id,
          assessmentRepository,
          certificationCompletedJobRepository,
        });

        // then
        expect(certificationCompletedJobRepository.performAsync).to.have.been.called;
      });
    });
  });
});

function _buildCompetenceEvaluationAssessment() {
  return domainBuilder.buildAssessment.ofTypeCompetenceEvaluation({
    id: Symbol('assessmentId'),
    state: 'started',
  });
}

function _buildCampaignAssessment() {
  return domainBuilder.buildAssessment.ofTypeCampaign({
    id: Symbol('assessmentId'),
    state: 'started',
    type: Assessment.types.CAMPAIGN,
    userId: Symbol('userId'),
    campaignParticipationId: Symbol('campaignParticipationId'),
  });
}

function _buildCertificationAssessment() {
  return domainBuilder.buildAssessment({
    id: Symbol('assessmentId'),
    certificationCourseId: Symbol('certificationCourseId'),
    state: 'started',
    type: Assessment.types.CERTIFICATION,
  });
}
