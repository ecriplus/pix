import { usecases } from '../../../../../../src/prescription/campaign-participation/domain/usecases/index.js';
import {
  databaseBuilder,
  expect,
  knex,
  learningContentBuilder,
  mockLearningContent,
} from '../../../../../test-helper.js';

describe('Integration | Domain | UseCases | send-completed-participation-results-to-pole-emploi', function () {
  let campaignParticipationId, userId;

  beforeEach(async function () {
    userId = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildAuthenticationMethod.withPoleEmploiAsIdentityProvider({ userId });

    const organizationId = databaseBuilder.factory.buildOrganization().id;
    const tagId = databaseBuilder.factory.buildTag({ name: 'POLE EMPLOI' }).id;
    databaseBuilder.factory.buildOrganizationTag({ organizationId, tagId });
    const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
    databaseBuilder.factory.buildCampaignSkill({ campaignId });
    campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId }).id;
    databaseBuilder.factory.buildAssessment({ campaignParticipationId, userId });
    const learningContentObjects = learningContentBuilder.fromAreas([]);
    await mockLearningContent(learningContentObjects);
    return databaseBuilder.commit();
  });

  it('should register pole emploi sendings', async function () {
    // when
    await usecases.sendCompletedParticipationResultsToPoleEmploi({
      campaignParticipationId,
    });

    // then
    const poleEmploiSendings = await knex('pole-emploi-sendings').where({ campaignParticipationId });
    expect(poleEmploiSendings).to.have.lengthOf(1);
    expect(poleEmploiSendings[0].type).to.equal('CAMPAIGN_PARTICIPATION_COMPLETION');
  });
});
