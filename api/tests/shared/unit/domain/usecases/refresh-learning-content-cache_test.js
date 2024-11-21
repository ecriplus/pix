import { refreshLearningContentCache } from '../../../../../src/shared/domain/usecases/refresh-learning-content-cache.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | Domain | Usecase | Refresh learning content cache', function () {
  describe('#refreshLearningContentCache', function () {
    it('should refresh learning content cache with what is returned from lcms api', async function () {
      // given
      const lcms = {
        getLatestRelease: sinon.stub(),
      };
      const LearningContentCache = {
        instance: {
          set: sinon.stub(),
        },
      };
      const learningContent = Symbol('LC');
      lcms.getLatestRelease.resolves(learningContent);

      // when
      await refreshLearningContentCache({ lcms, LearningContentCache });

      // then
      expect(LearningContentCache.instance.set).to.have.been.calledWithExactly(learningContent);
    });
  });
});
