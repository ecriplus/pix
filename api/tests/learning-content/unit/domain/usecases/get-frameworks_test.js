import { usecases } from '../../../../../src/learning-content/domain/usecases/index.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | UseCase | get-frameworks', function () {
  let sharedFrameworkRepository;

  beforeEach(function () {
    sharedFrameworkRepository = {
      list: sinon.stub(),
    };
  });

  it('should call sharedFrameworkRepository.list', async function () {
    // when
    await usecases.getFrameworks({
      sharedFrameworkRepository,
    });

    expect(sharedFrameworkRepository.list).to.have.been.called;
  });
});
