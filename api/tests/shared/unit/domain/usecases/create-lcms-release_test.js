import { createLcmsRelease } from '../../../../../src/shared/domain/usecases/create-lcms-release.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | UseCase | create-lcms-release', function () {
  it('should trigger an update of the learning content cache', async function () {
    // given
    const LearningContentCache = {
      instance: {
        update: sinon.stub(),
      },
    };

    // when
    await createLcmsRelease({ LearningContentCache });

    // then
    expect(LearningContentCache.instance.update).to.have.been.called;
  });
});
