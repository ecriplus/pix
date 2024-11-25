import { initLearningContentCache } from '../../../../../src/shared/domain/usecases/init-learning-content-cache.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | Domain | Usecase | Init learning content cache', function () {
  describe('#initLearningContentCache', function () {
    it('should init learning content cache ', async function () {
      // given
      const LearningContentCache = {
        instance: {
          get: sinon.stub(),
        },
      };

      // when
      await initLearningContentCache({ LearningContentCache });

      // then
      expect(LearningContentCache.instance.get).to.have.been.calledOnce;
    });
  });
});
