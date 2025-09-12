import { RecommendedModule } from '../../../../../src/devcomp/domain/read-models/RecommendedModule.js';
import { usecases } from '../../../../../src/devcomp/domain/usecases/index.js';
import { databaseBuilder, expect, nock } from '../../../../test-helper.js';

describe('Integration | DevComp | Domain | Usecases | findRecommendedModulesByCampaignParticipationIds', function () {
  it('it returns recommended modules for given participation ids', async function () {
    // given
    const { id: campaignParticipationId1, userId } = databaseBuilder.factory.buildCampaignParticipation();
    const { id: campaignParticipationId2 } = databaseBuilder.factory.buildCampaignParticipation({ userId });

    const moduleId = '5df14039-803b-4db4-9778-67e4b84afbbd';
    const training = databaseBuilder.factory.buildTraining({
      type: 'modulix',
      link: '/modules/adresse-ip-publique-et-vous/details',
    });
    const secondModuleId = 'f7b3a2e1-0d5c-4c6c-9c4d-1a3d8f7e9f5d';
    const secondTraining = databaseBuilder.factory.buildTraining({
      type: 'modulix',
      link: '/modules/bien-ecrire-son-adresse-mail/details',
    });

    databaseBuilder.factory.buildUserRecommendedTraining({
      userId,
      trainingId: training.id,
      campaignParticipationId: campaignParticipationId1,
    }).id;
    databaseBuilder.factory.buildUserRecommendedTraining({
      userId,
      trainingId: secondTraining.id,
      campaignParticipationId: campaignParticipationId2,
    }).id;
    await databaseBuilder.commit();

    const recommendedModules = await usecases.findRecommendedModulesByCampaignParticipationIds({
      campaignParticipationIds: [campaignParticipationId1, campaignParticipationId2],
    });

    expect(recommendedModules).to.have.lengthOf(2);
    expect(recommendedModules[0]).to.be.an.instanceOf(RecommendedModule);
    expect(recommendedModules[0]).to.be.deep.equal({ id: training.id, moduleId });
    expect(recommendedModules[1]).to.be.an.instanceOf(RecommendedModule);
    expect(recommendedModules[1]).to.be.deep.equal({ id: secondTraining.id, moduleId: secondModuleId });
  });
  it('ignores module when its slug does not pass regex', async function () {
    // given
    nock('https://assets.pix.org').persist().head(/^.+$/).reply(200, {});
    const { id: campaignParticipationId1, userId } = databaseBuilder.factory.buildCampaignParticipation();
    const { id: campaignParticipationId2 } = databaseBuilder.factory.buildCampaignParticipation({ userId });

    const moduleId = '5df14039-803b-4db4-9778-67e4b84afbbd';
    const training = databaseBuilder.factory.buildTraining({
      type: 'modulix',
      link: '/modules/adresse-ip-publique-et-vous/details',
    });
    const secondTraining = databaseBuilder.factory.buildTraining({
      type: 'modulix',
      link: '/campagnes/module123',
    });

    databaseBuilder.factory.buildUserRecommendedTraining({
      userId,
      trainingId: training.id,
      campaignParticipationId: campaignParticipationId1,
    }).id;
    databaseBuilder.factory.buildUserRecommendedTraining({
      userId,
      trainingId: secondTraining.id,
      campaignParticipationId: campaignParticipationId2,
    }).id;
    await databaseBuilder.commit();

    const recommendedModules = await usecases.findRecommendedModulesByCampaignParticipationIds({
      campaignParticipationIds: [campaignParticipationId1, campaignParticipationId2],
    });

    expect(recommendedModules).to.have.lengthOf(1);
    expect(recommendedModules[0]).to.be.an.instanceOf(RecommendedModule);
    expect(recommendedModules[0]).to.be.deep.equal({ id: training.id, moduleId });
  });
});
