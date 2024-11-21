import { learningContentCache } from '../../../../../src/shared/infrastructure/caches/learning-content-cache.js';
import { expect, mockLearningContent } from '../../../../test-helper.js';

describe('Integration | Infrastructure | Caches | LearningContentCache', function () {
  describe('#get', function () {
    it('should get learning content from underlying cache (redis not used in test)', async function () {
      // given
      const learningContent = { models: [{ id: 'recId' }] };
      const lcmsApiCall = mockLearningContent(learningContent);

      // when
      const result = await learningContentCache.get();

      // then
      expect(result).to.deep.equal(learningContent);
      expect(lcmsApiCall.isDone()).to.be.true;
    });
  });
});
