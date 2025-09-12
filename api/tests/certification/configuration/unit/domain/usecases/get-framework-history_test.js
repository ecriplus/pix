import { getFrameworkHistory } from '../../../../../../src/certification/configuration/domain/usecases/get-framework-history.js';
import { expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Configuration | Unit | UseCase | get-framework-history', function () {
  it('should return the framework history', async function () {
    // given
    const complementaryCertificationKey = Symbol('complementaryCertificationKey');

    const consolidatedFrameworkRepository = {
      getFrameworkHistory: sinon.stub(),
    };

    const currentFrameworkVersion = '20250607080000';
    const previousFrameworkVersion = '20241021080000';

    consolidatedFrameworkRepository.getFrameworkHistory.resolves([currentFrameworkVersion, previousFrameworkVersion]);

    // when
    const frameworkHistory = await getFrameworkHistory({
      complementaryCertificationKey,
      consolidatedFrameworkRepository,
    });

    // then
    expect(consolidatedFrameworkRepository.getFrameworkHistory).to.have.been.calledOnceWithExactly({
      complementaryCertificationKey,
    });

    expect(frameworkHistory).to.deep.equal([currentFrameworkVersion, previousFrameworkVersion]);
  });
});
