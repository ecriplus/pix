import * as selectNextCertificationChallengeApi from '../../../../../../src/certification/evaluation/application/api/select-next-certification-challenge-api.js';
import { usecases } from '../../../../../../src/certification/evaluation/domain/usecases/index.js';
import { LOCALE } from '../../../../../../src/shared/domain/constants.js';
import { DomainTransaction } from '../../../../../../src/shared/domain/DomainTransaction.js';
import { Assessment } from '../../../../../../src/shared/domain/models/index.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Application | Certification | Evaluation | API', function () {
  describe('#selectNextCertificationChallenge', function () {
    context('when the certification is V2', function () {
      it('should call getNextChallengeForV2Certification', async function () {
        // given
        sinon.stub(DomainTransaction, 'execute').callsFake((fn) => fn({}));
        const certificationAssessment = new Assessment({
          id: 'assessmentId',
          type: Assessment.types.CERTIFICATION,
        });

        const certificationCourse = domainBuilder.buildCertificationCourse({ version: 2 });

        const locale = LOCALE.FRENCH_SPOKEN;
        const dependencies = {
          assessmentRepository: {
            get: sinon.stub(),
          },

          certificationCourseRepository: {
            get: sinon.stub(),
          },
        };

        dependencies.assessmentRepository.get.resolves(certificationAssessment);
        dependencies.certificationCourseRepository.get
          .withArgs({ id: certificationAssessment.certificationCourseId })
          .resolves(certificationCourse);

        sinon.stub(usecases, 'getNextChallengeForV2Certification');

        // when
        await selectNextCertificationChallengeApi.selectNextCertificationChallenge({
          assessmentId: 'assessmentId',
          locale,
          dependencies,
        });

        // then
        expect(usecases.getNextChallengeForV2Certification).to.have.been.called;
      });
    });

    context('when the certification is V3', function () {
      it('should call getNextChallenge', async function () {
        // given
        sinon.stub(DomainTransaction, 'execute').callsFake((fn) => fn({}));
        const certificationAssessment = new Assessment({
          id: 'assessmentId',
          type: Assessment.types.CERTIFICATION,
        });

        const certificationCourse = domainBuilder.buildCertificationCourse({ version: 3 });

        const locale = LOCALE.FRENCH_SPOKEN;
        const dependencies = {
          assessmentRepository: {
            get: sinon.stub(),
          },

          certificationCourseRepository: {
            get: sinon.stub(),
          },
        };

        dependencies.assessmentRepository.get.resolves(certificationAssessment);
        dependencies.certificationCourseRepository.get
          .withArgs({ id: certificationAssessment.certificationCourseId })
          .resolves(certificationCourse);

        sinon.stub(usecases, 'getNextChallenge');

        // when
        await selectNextCertificationChallengeApi.selectNextCertificationChallenge({
          assessmentId: 'assessmentId',
          locale,
          dependencies,
        });

        // then
        expect(usecases.getNextChallenge).to.have.been.called;
      });
    });
  });
});
