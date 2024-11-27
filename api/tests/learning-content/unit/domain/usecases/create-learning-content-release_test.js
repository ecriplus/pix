import { createLearningContentRelease } from '../../../../../src/learning-content/domain/usecases/create-learning-content-release.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | UseCase | create-learning-content-release', function () {
  it('should call update on the learning content cache', async function () {
    // given
    const LearningContentCache = {
      instance: {
        update: sinon.stub(),
      },
    };

    // when
    await createLearningContentRelease({ LearningContentCache });

    // then
    expect(LearningContentCache.instance.update).to.have.been.called;
  });
});
