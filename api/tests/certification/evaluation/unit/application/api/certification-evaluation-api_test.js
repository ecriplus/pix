import * as certificationEvaluationApi from '../../../../../../src/certification/evaluation/application/api/certification-evaluation-api.js';
import { usecases } from '../../../../../../src/certification/evaluation/domain/usecases/index.js';
import { DomainTransaction } from '../../../../../../src/shared/domain/DomainTransaction.js';
import { Assessment } from '../../../../../../src/shared/domain/models/Assessment.js';
import { FRENCH_SPOKEN } from '../../../../../../src/shared/domain/services/locale-service.js';
import { expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Application | Certification | Evaluation | API', function () {
  describe('#selectNextCertificationChallenge', function () {
    it('should call getNextChallenge', async function () {
      // given
      sinon.stub(DomainTransaction, 'execute').callsFake((fn) => fn({}));
      const certificationAssessment = new Assessment({
        id: 'assessmentId',
        type: Assessment.types.CERTIFICATION,
      });

      const locale = FRENCH_SPOKEN;
      const dependencies = {
        assessmentRepository: {
          get: sinon.stub(),
        },
      };

      dependencies.assessmentRepository.get.resolves(certificationAssessment);
      sinon.stub(usecases, 'getNextChallenge');

      // when
      await certificationEvaluationApi.selectNextCertificationChallenge({
        assessmentId: 'assessmentId',
        locale,
        dependencies,
      });

      // then
      expect(usecases.getNextChallenge).to.have.been.called;
    });
  });

  describe('#completeCertificationTest', function () {
    it('should call completeCertificationTest', async function () {
      // given
      const locale = Symbol('locale');
      const certificationCourseId = Symbol('certificationCourseId');
      sinon.stub(usecases, 'completeCertificationTest');

      // when
      await certificationEvaluationApi.completeCertificationTest({ certificationCourseId, locale });

      // then
      expect(usecases.completeCertificationTest).to.have.been.calledOnceWith({ locale, certificationCourseId });
    });
  });
});
