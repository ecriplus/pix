import { getGlobalMeshLevel } from '../../../../../../src/certification/results/domain/usecases/get-global-mesh-level.js';
import { getI18n } from '../../../../../../src/shared/infrastructure/i18n/i18n.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Results | Unit | Domain | UseCases | get-global-mesh-level', function () {
  let scoringConfigurationRepository, pixScoreToMeshLevelService;

  beforeEach(function () {
    scoringConfigurationRepository = {
      getLatestByDateAndLocale: sinon.stub(),
    };

    pixScoreToMeshLevelService = {
      getMeshLevel: sinon.stub(),
    };
  });

  it('should return the global mesh level', async function () {
    // given
    const i18n = getI18n();
    const pixScore = 12;
    const certificationDate = new Date();

    const scoringConfiguration = domainBuilder.buildV3CertificationScoring({});
    scoringConfigurationRepository.getLatestByDateAndLocale.resolves(scoringConfiguration);

    const globalMeshLevel = domainBuilder.certification.results.buildGlobalCertificationLevel();
    pixScoreToMeshLevelService.getMeshLevel.returns(globalMeshLevel);

    // when
    const result = await getGlobalMeshLevel({
      pixScore,
      certificationDate,
      i18n,
      scoringConfigurationRepository,
      pixScoreToMeshLevelService,
    });

    // then
    expect(result).to.deep.equal(globalMeshLevel);
    expect(scoringConfigurationRepository.getLatestByDateAndLocale).to.have.been.calledOnceWithExactly({
      date: certificationDate,
      locale: i18n.getLocale(),
    });
    expect(pixScoreToMeshLevelService.getMeshLevel).to.have.been.calledOnceWithExactly({
      pixScore,
      scoringConfiguration,
    });
  });
});
