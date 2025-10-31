import { getFrameworkHistory } from '../../../../../../src/certification/configuration/domain/usecases/get-framework-history.js';
import { expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Configuration | Unit | UseCase | get-framework-history', function () {
  it('should return the framework history', async function () {
    // given
    const complementaryCertificationKey = Symbol('complementaryCertificationKey');

    const versionsRepository = {
      getFrameworkHistory: sinon.stub(),
    };

    const currentVersionId = 456;
    const previousVersionId = 123;

    versionsRepository.getFrameworkHistory.resolves([currentVersionId, previousVersionId]);

    // when
    const frameworkHistory = await getFrameworkHistory({
      complementaryCertificationKey,
      versionsRepository,
    });

    // then
    expect(versionsRepository.getFrameworkHistory).to.have.been.calledOnceWithExactly({
      scope: complementaryCertificationKey,
    });

    expect(frameworkHistory).to.deep.equal([currentVersionId, previousVersionId]);
  });
});
