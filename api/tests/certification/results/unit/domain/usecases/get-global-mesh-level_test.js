import { getGlobalMeshLevel } from '../../../../../../src/certification/results/domain/usecases/get-global-mesh-level.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Results | Unit | Domain | UseCases | get-global-mesh-level', function () {
  it('should return the global mesh level', async function () {
    const pixScoreToMeshLevelService = {
      getMeshLevel: sinon.stub(),
    };
    // given
    const pixScore = 12;

    const globalMeshLevel = domainBuilder.certification.results.buildGlobalCertificationLevel();
    pixScoreToMeshLevelService.getMeshLevel.returns(globalMeshLevel);

    // when
    const result = await getGlobalMeshLevel({
      pixScore,
      pixScoreToMeshLevelService,
    });

    // then
    expect(result).to.deep.equal(globalMeshLevel);
    expect(pixScoreToMeshLevelService.getMeshLevel).to.have.been.calledOnceWithExactly({ pixScore });
  });
});
