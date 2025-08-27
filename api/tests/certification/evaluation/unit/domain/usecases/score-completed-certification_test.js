import { scoreCompletedCertification } from '../../../../../../src/certification/evaluation/domain/usecases/score-completed-certification.js';
import { AlgorithmEngineVersion } from '../../../../../../src/certification/shared/domain/models/AlgorithmEngineVersion.js';
import {
  ABORT_REASONS,
  CertificationCourse,
} from '../../../../../../src/certification/shared/domain/models/CertificationCourse.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import { DomainTransaction } from '../../../../../../src/shared/domain/DomainTransaction.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Certification | Evaluation | UseCases | scoreCompletedCertification', function () {
  let certificationCourseRepository;
  let certificationAssessmentRepository;
  let services;

  let now;
  let clock;

  beforeEach(function () {
    sinon.stub(DomainTransaction, 'execute').callsFake((callback) => {
      return callback();
    });
    clock = sinon.useFakeTimers({ now: new Date('2019-01-01T05:06:07Z'), toFake: ['Date'] });
    now = new Date(clock.now);

    services = {
      handleV3CertificationScoring: sinon.stub(),
      scoreDoubleCertificationV3: sinon.stub().throws(new Error('Expected to be called')),
    };
    certificationCourseRepository = {
      get: sinon.stub(),
      update: sinon.stub(),
      getCreationDate: sinon.stub(),
    };
    certificationAssessmentRepository = {
      get: sinon.stub(),
    };
  });

  afterEach(function () {
    clock.restore();
  });

  context('when assessment is of type CERTIFICATION', function () {
    const assessmentId = 1214;
    const certificationCourseId = 1234;
    const userId = 4567;
    let certificationCourse;
    const certificationCourseStartDate = new Date('2022-02-01');

    beforeEach(function () {
      certificationCourse = domainBuilder.buildCertificationCourse({
        id: certificationCourseId,
        createdAt: certificationCourseStartDate,
        completedAt: null,
      });
    });

    describe('when the candidate has passed a complementary certification', function () {
      it('should do nothing', async function () {
        // given
        certificationAssessmentRepository.get.resolves(
          domainBuilder.buildCertificationAssessment({
            id: assessmentId,
            certificationCourseId,
            userId,
            certificationChallenges: [
              domainBuilder.buildCertificationChallengeWithType({
                certifiableBadgeKey: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
              }),
            ],
            version: AlgorithmEngineVersion.V3,
          }),
        );
        const dependencies = {
          certificationCourseRepository,
          certificationAssessmentRepository,
          services,
        };

        // when
        await scoreCompletedCertification({ ...dependencies });

        // then
        expect(certificationCourseRepository.update).to.not.have.been.called;
        expect(services.scoreDoubleCertificationV3).to.not.have.been.called;
      });
    });

    describe('when less than the minimum number of answers required by the config has been answered', function () {
      describe('when the candidate did not finish due to a lack of time', function () {
        it('completes the certification', async function () {
          // given
          const abortedCertificationCourse = domainBuilder.buildCertificationCourse({
            id: certificationCourseId,
            createdAt: certificationCourseStartDate,
            abortReason: ABORT_REASONS.CANDIDATE,
          });

          certificationAssessmentRepository.get.resolves(
            domainBuilder.buildCertificationAssessment({
              id: assessmentId,
              certificationCourseId,
              userId,
              version: AlgorithmEngineVersion.V3,
            }),
          );
          services.handleV3CertificationScoring.resolves(abortedCertificationCourse);
          services.scoreDoubleCertificationV3.resolves();

          const dependencies = {
            certificationCourseRepository,
            certificationAssessmentRepository,
            services,
          };

          // when
          await scoreCompletedCertification({ ...dependencies });

          // then
          expect(certificationCourseRepository.update).to.have.been.calledWithExactly({
            certificationCourse: new CertificationCourse({
              ...certificationCourse.toDTO(),
              completedAt: now,
              abortReason: ABORT_REASONS.CANDIDATE,
            }),
          });
          expect(services.scoreDoubleCertificationV3).to.have.been.calledWithExactly({
            certificationCourseId: certificationCourse.getId(),
          });
        });
      });
    });

    describe('when at least the minimum number of answers required by the config has been answered', function () {
      describe('when the certification was completed', function () {
        it('completes the certification', async function () {
          // given
          const certificationCourse = domainBuilder.buildCertificationCourse({
            id: certificationCourseId,
            createdAt: certificationCourseStartDate,
            completedAt: null,
          });

          certificationAssessmentRepository.get.resolves(
            domainBuilder.buildCertificationAssessment({
              id: assessmentId,
              certificationCourseId,
              userId,
              version: AlgorithmEngineVersion.V3,
            }),
          );
          services.handleV3CertificationScoring.resolves(certificationCourse);
          services.scoreDoubleCertificationV3.resolves();

          const dependencies = {
            certificationCourseRepository,
            certificationAssessmentRepository,
            services,
          };

          // when
          await scoreCompletedCertification({ ...dependencies });

          // then
          expect(certificationCourseRepository.update).to.have.been.calledWithExactly({
            certificationCourse: new CertificationCourse({
              ...certificationCourse.toDTO(),
              completedAt: now,
            }),
          });
          expect(services.scoreDoubleCertificationV3).to.have.been.calledWithExactly({
            certificationCourseId: certificationCourse.getId(),
          });
        });
      });

      describe('when the certification was not completed', function () {
        describe('when the candidate did not finish due to technical difficulties', function () {
          it('completes the certification with the raw score', async function () {
            // given
            const abortReason = ABORT_REASONS.TECHNICAL;
            const certificationCourse = domainBuilder.buildCertificationCourse({
              id: certificationCourseId,
              createdAt: certificationCourseStartDate,
              completedAt: null,
              abortReason,
            });

            certificationAssessmentRepository.get.resolves(
              domainBuilder.buildCertificationAssessment({
                id: assessmentId,
                certificationCourseId,
                userId,
                version: AlgorithmEngineVersion.V3,
              }),
            );
            services.handleV3CertificationScoring.resolves(certificationCourse);
            services.scoreDoubleCertificationV3.resolves(certificationCourse);

            const dependencies = {
              certificationCourseRepository,
              certificationAssessmentRepository,
              services,
            };

            // when
            await scoreCompletedCertification({ ...dependencies });

            // then
            expect(certificationCourseRepository.update).to.have.been.calledWithExactly({
              certificationCourse: new CertificationCourse({
                ...certificationCourse.toDTO(),
                completedAt: now,
                abortReason,
              }),
            });
            expect(services.scoreDoubleCertificationV3).to.have.been.calledWithExactly({
              certificationCourseId: certificationCourse.getId(),
            });
          });
        });

        describe('when the candidate did not finish in time', function () {
          it('completes the certification', async function () {
            // given
            const abortReason = ABORT_REASONS.CANDIDATE;
            const certificationCourse = domainBuilder.buildCertificationCourse({
              id: certificationCourseId,
              createdAt: certificationCourseStartDate,
              completedAt: null,
              abortReason,
            });

            certificationAssessmentRepository.get.resolves(
              domainBuilder.buildCertificationAssessment({
                id: assessmentId,
                certificationCourseId,
                userId,
                version: AlgorithmEngineVersion.V3,
              }),
            );
            services.handleV3CertificationScoring.resolves(certificationCourse);
            services.scoreDoubleCertificationV3.resolves(certificationCourse);

            const dependencies = {
              certificationCourseRepository,
              certificationAssessmentRepository,
              services,
            };

            // when
            await scoreCompletedCertification({ ...dependencies });

            // then
            expect(certificationCourseRepository.update).to.have.been.calledWithExactly({
              certificationCourse: new CertificationCourse({
                ...certificationCourse.toDTO(),
                completedAt: now,
                abortReason,
              }),
            });
            expect(services.scoreDoubleCertificationV3).to.have.been.calledWithExactly({
              certificationCourseId: certificationCourse.getId(),
            });
          });
        });
      });
    });
  });
});
