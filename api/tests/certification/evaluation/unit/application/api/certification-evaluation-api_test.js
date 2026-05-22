import sinon from 'sinon';

import * as certificationEvaluationApi from '../../../../../../src/certification/evaluation/application/api/certification-evaluation-api.js';
import { usecases } from '../../../../../../src/certification/evaluation/domain/usecases/index.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Application | Certification | Evaluation | API', function () {
  describe('#completeCertificationAssessment', function () {
    it('should call completeCertificationAssessment', async function () {
      // given
      const locale = Symbol('locale');
      const certificationCourseId = Symbol('certificationCourseId');
      sinon.stub(usecases, 'completeCertificationAssessment');

      // when
      await certificationEvaluationApi.completeCertificationAssessment({ certificationCourseId, locale });

      // then
      expect(usecases.completeCertificationAssessment).to.have.been.calledOnceWith({ locale, certificationCourseId });
    });
  });
});
