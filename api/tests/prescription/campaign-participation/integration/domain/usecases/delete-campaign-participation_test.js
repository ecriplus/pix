import { usecases } from '../../../../../../src/prescription/campaign-participation/domain/usecases/index.js';
import { featureToggles } from '../../../../../../src/shared/infrastructure/feature-toggles/index.js';
import { databaseBuilder, expect, knex, sinon } from '../../../../../test-helper.js';

const { buildUser, buildTargetProfile, buildBadge, buildCampaignParticipation, buildBadgeAcquisition, buildCampaign } =
  databaseBuilder.factory;

describe('Integration | UseCases | delete-campaign-participation', function () {
  let clock, now;

  beforeEach(function () {
    now = new Date(2023, 3, 3);
    clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
  });

  afterEach(function () {
    clock.restore();
  });

  it('should delete all campaignParticipations', async function () {
    // given
    await featureToggles.set('isAnonymizationWithDeletionEnabled', false);

    const adminUserId = databaseBuilder.factory.buildUser().id;
    const userId = databaseBuilder.factory.buildUser().id;
    const campaignId = databaseBuilder.factory.buildCampaign().id;
    const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ userId }).id;
    databaseBuilder.factory.buildCampaignParticipation({
      isImproved: true,
      participantExternalId: 'email olala',
      organizationLearnerId,
      userId,
      deletedAt: null,
      deletedBy: null,
      campaignId,
    });
    const campaignParticipationToDelete = databaseBuilder.factory.buildCampaignParticipation({
      isImproved: false,
      organizationLearnerId,
      userId,
      deletedAt: null,
      deletedBy: null,
      participantExternalId: 'email olala',
      campaignId,
    });

    await databaseBuilder.commit();

    // when
    await usecases.deleteCampaignParticipation({
      userId: adminUserId,
      campaignId,
      campaignParticipationId: campaignParticipationToDelete.id,
    });

    // then
    const results = await knex('campaign-participations').where({ organizationLearnerId });

    expect(results).to.have.lengthOf(2);
    results.forEach((campaignParticipaton) => {
      expect(campaignParticipaton.participantExternalId).not.to.equal(null);
      expect(campaignParticipaton.userId).to.equal(userId);
      expect(campaignParticipaton.deletedAt).to.deep.equal(now);
      expect(campaignParticipaton.deletedBy).to.equal(adminUserId);
    });
  });

  it('should delete all campaignParticipations with anonymization', async function () {
    // given
    await featureToggles.set('isAnonymizationWithDeletionEnabled', true);

    const adminUserId = databaseBuilder.factory.buildUser().id;
    const campaignId = databaseBuilder.factory.buildCampaign().id;
    const userId = databaseBuilder.factory.buildUser().id;
    const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ userId }).id;
    databaseBuilder.factory.buildCampaignParticipation({
      isImproved: true,
      organizationLearnerId,
      participantExternalId: 'email olala',
      userId,
      deletedAt: null,
      deletedBy: null,

      campaignId,
    });
    const campaignParticipationToDelete = databaseBuilder.factory.buildCampaignParticipation({
      isImproved: false,
      organizationLearnerId,
      participantExternalId: 'email olala',
      userId,
      deletedAt: null,
      deletedBy: null,

      campaignId,
    });

    await databaseBuilder.commit();

    // when
    await usecases.deleteCampaignParticipation({
      userId: adminUserId,
      campaignId,
      campaignParticipationId: campaignParticipationToDelete.id,
    });

    // then
    const results = await knex('campaign-participations').where({ organizationLearnerId });

    expect(results).to.have.lengthOf(2);
    results.forEach((campaignParticipaton) => {
      expect(campaignParticipaton.userId).to.equal(null);
      expect(campaignParticipaton.participantExternalId).to.equal(null);
      expect(campaignParticipaton.deletedAt).to.deep.equal(now);
      expect(campaignParticipaton.deletedBy).to.equal(adminUserId);
    });
  });

  context('when there are badges linked to the campaign participations', function () {
    let badgesAcquisitions;

    let campaignParticipationId;
    let certifiableBadge;
    let nonCertifiableBadge;
    let userId;

    before(async function () {
      // given
      const adminUserId = buildUser().id;
      const targetProfileId = buildTargetProfile().id;
      nonCertifiableBadge = buildBadge({
        targetProfileId,
        isCertifiable: false,
      });
      certifiableBadge = buildBadge({
        targetProfileId,
        isCertifiable: true,
      });
      const campaignId = buildCampaign({ targetProfileId }).id;
      userId = buildUser().id;
      campaignParticipationId = buildCampaignParticipation({
        campaignId,
        userId,
      }).id;

      buildBadgeAcquisition({
        badgeId: certifiableBadge.id,
        campaignParticipationId,
        userId,
      });
      buildBadgeAcquisition({
        badgeId: nonCertifiableBadge.id,
        campaignParticipationId,
        userId,
      });

      await databaseBuilder.commit();

      // when
      await usecases.deleteCampaignParticipation({
        userId: adminUserId,
        campaignId,
        campaignParticipationId,
      });

      badgesAcquisitions = await knex('badge-acquisitions').where({
        campaignParticipationId,
      });
    });

    it('should delete userId on non certifiable badgesAcquisitions', function () {
      const nonCertifiableBadgeAcquisition = badgesAcquisitions.find(
        (badgeAcquisition) => badgeAcquisition.badgeId === nonCertifiableBadge.id,
      );
      expect(nonCertifiableBadgeAcquisition.userId).to.be.null;
    });

    it('should not delete userId on certifiable badgesAcquisitions', function () {
      const certifiableBadgeAcquisition = badgesAcquisitions.find(
        (badgeAcquisition) => badgeAcquisition.badgeId === certifiableBadge.id,
      );
      expect(certifiableBadgeAcquisition.userId).to.equal(userId);
    });
  });
});
