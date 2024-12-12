import { up as migrationToTest } from '../../../db/migrations/20241210103623_delete-shared-when-participation-is-to-share.js';
import { CampaignParticipationStatuses } from '../../../src/prescription/shared/domain/constants.js';
import { databaseBuilder, expect, knex } from '../../test-helper.js';

describe('Integration | Migration | delete-shared-when-participation-is-to-share', function () {
  let buggyParticipation, sharedParticipation, sharedAt;

  beforeEach(async function () {
    sharedAt = new Date(2024, 10, 1);
    const user = databaseBuilder.factory.buildUser();
    const learner = databaseBuilder.factory.prescription.organizationLearners.buildOrganizationLearner({
      userId: user.id,
    });
    const user2 = databaseBuilder.factory.buildUser();
    const learner2 = databaseBuilder.factory.prescription.organizationLearners.buildOrganizationLearner({
      userId: user2.id,
    });
    const campaign = databaseBuilder.factory.buildCampaign();
    buggyParticipation = databaseBuilder.factory.buildCampaignParticipation({
      campaignId: campaign.id,
      organizationLearnerId: learner.id,
      userId: user.id,
      status: CampaignParticipationStatuses.TO_SHARE,
      sharedAt,
    });

    sharedParticipation = databaseBuilder.factory.buildCampaignParticipation({
      campaignId: campaign.id,
      organizationLearnerId: learner2.id,
      userId: user2.id,
      status: CampaignParticipationStatuses.SHARED,
      sharedAt,
    });

    await databaseBuilder.commit();
  });

  it('should set sharedAt at null for participation with sharedAt and status is TO_SHARE', async function () {
    // when
    await migrationToTest(knex);
    // then
    const patchedParticipation = await knex('campaign-participations').where('id', buggyParticipation.id).first();

    expect(patchedParticipation.sharedAt).is.null;
  });

  it('should not update SHARED participation', async function () {
    // when
    await migrationToTest(knex);

    // then
    const participation = await knex('campaign-participations').where('id', sharedParticipation.id).first();

    expect(participation.sharedAt).deep.equal(sharedAt);
  });
});
