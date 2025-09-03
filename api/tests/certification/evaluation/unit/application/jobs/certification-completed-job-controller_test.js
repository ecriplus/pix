import { CertificationCompletedJobController } from '../../../../../../src/certification/evaluation/application/jobs/certification-completed-job-controller.js';
import { CertificationCompletedJob } from '../../../../../../src/certification/evaluation/domain/events/CertificationCompleted.js';
import { usecases } from '../../../../../../src/certification/evaluation/domain/usecases/index.js';
import { FRENCH_SPOKEN } from '../../../../../../src/shared/domain/services/locale-service.js';
import { expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Certification | Application | jobs | CertificationCompletedJobController', function () {
  let certificationCompletedJobController;

  beforeEach(function () {
    certificationCompletedJobController = new CertificationCompletedJobController();
  });

  context('when assessment is of type CERTIFICATION', function () {
    const certificationCourseId = 123;
    const userId = 4567;
    let data;

    beforeEach(function () {
      data = new CertificationCompletedJob({
        certificationCourseId,
        userId,
        locale: FRENCH_SPOKEN,
      });
    });

    it('should call the scoreCompletedCertification usecase', async function () {
      // given
      sinon.stub(usecases, 'scoreCompletedCertification');

      // when
      await certificationCompletedJobController.handle({
        data,
      });

      // then
      expect(usecases.scoreCompletedCertification).to.have.been.calledWithExactly({
        certificationCourseId: data.certificationCourseId,
        locale: FRENCH_SPOKEN,
      });
    });
  });
});
