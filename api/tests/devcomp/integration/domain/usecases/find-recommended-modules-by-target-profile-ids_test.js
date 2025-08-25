import { RecommendedModule } from '../../../../../src/devcomp/domain/read-models/RecommendedModule.js';
import { usecases } from '../../../../../src/devcomp/domain/usecases/index.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('DevComp | Integration | Domain | Usecases | findRecommendedModulesByTargetProfileIds', function () {
  it('it returns recommended modules for given target-profile ids', async function () {
    // given
    const targetProfileId1 = databaseBuilder.factory.buildTargetProfile().id;
    const targetProfileId2 = databaseBuilder.factory.buildTargetProfile().id;
    const moduleId = '5df14039-803b-4db4-9778-67e4b84afbbd';
    const training = databaseBuilder.factory.buildTraining({
      type: 'modulix',
      link: '/modules/adresse-ip-publique-et-vous/details',
    });

    databaseBuilder.factory.buildTargetProfileTraining({ targetProfileId: targetProfileId1, trainingId: training.id });
    databaseBuilder.factory.buildTargetProfileTraining({ targetProfileId: targetProfileId2, trainingId: training.id });
    await databaseBuilder.commit();

    const recommendedModules = await usecases.findRecommendedModulesByTargetProfileIds({
      targetProfileIds: [targetProfileId1, targetProfileId2],
    });

    expect(recommendedModules).to.have.lengthOf(1);
    expect(recommendedModules[0]).to.be.an.instanceOf(RecommendedModule);
    expect(recommendedModules[0]).to.be.deep.equal({
      id: training.id,
      moduleId,
      targetProfileIds: [targetProfileId1, targetProfileId2],
    });
  });
  it('it returns recommended modules for given target-profile ids when link is absolute', async function () {
    // given
    const targetProfileId1 = databaseBuilder.factory.buildTargetProfile().id;
    const moduleId = '5df14039-803b-4db4-9778-67e4b84afbbd';
    const training = databaseBuilder.factory.buildTraining({
      type: 'modulix',
      link: 'http://app.pix.fr/modules/adresse-ip-publique-et-vous/details',
    });

    databaseBuilder.factory.buildTargetProfileTraining({ targetProfileId: targetProfileId1, trainingId: training.id });
    await databaseBuilder.commit();

    const recommendedModules = await usecases.findRecommendedModulesByTargetProfileIds({
      targetProfileIds: [targetProfileId1],
    });

    expect(recommendedModules).to.have.lengthOf(1);
    expect(recommendedModules[0]).to.be.an.instanceOf(RecommendedModule);
    expect(recommendedModules[0]).to.be.deep.equal({
      id: training.id,
      moduleId,
      targetProfileIds: [targetProfileId1],
    });
  });
});
