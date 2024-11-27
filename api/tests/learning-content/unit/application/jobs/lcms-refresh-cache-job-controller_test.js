import { LcmsCreateReleaseJobController } from '../../../../../src/learning-content/application/jobs/lcms-create-release-job-controller.js';
import { usecases } from '../../../../../src/learning-content/domain/usecases/index.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Learning Content | Unit | Application | Jobs | LcmsCreateReleaseJobController', function () {
  describe('#handle', function () {
    it('should call usecase', async function () {
      // given
      sinon.stub(usecases, 'createLearningContentRelease');
      const handler = new LcmsCreateReleaseJobController();

      // when
      await handler.handle();

      // then
      expect(usecases.createLearningContentRelease).to.have.been.calledOnce;
    });
  });
});
