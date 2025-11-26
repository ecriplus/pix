import { getFrameworkHistory } from '../../../../../../src/certification/configuration/domain/usecases/get-framework-history.js';
import { expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Configuration | Unit | UseCase | get-framework-history', function () {
  it('should return the framework history', async function () {
    // given
    const complementaryCertificationKey = Symbol('complementaryCertificationKey');

    const versionsRepository = {
      getFrameworkHistory: sinon.stub(),
    };

    const currentVersion = { id: 456, startDate: new Date('2024-01-01'), expirationDate: new Date('2025-02-02') };
    const previousVersion = { id: 123, startDate: new Date('2022-01-01'), expirationDate: new Date('2024-01-01') };

    versionsRepository.getFrameworkHistory.resolves([currentVersion, previousVersion]);

    // when
    const frameworkHistory = await getFrameworkHistory({
      complementaryCertificationKey,
      versionsRepository,
    });

    // then
    expect(versionsRepository.getFrameworkHistory).to.have.been.calledOnceWithExactly({
      scope: complementaryCertificationKey,
    });

    expect(frameworkHistory).to.deep.equal([currentVersion, previousVersion]);
  });
});
