import { usecases } from '../../../../../../src/prescription/campaign-participation/domain/usecases/index.js';
import { Assessment } from '../../../../../../src/shared/domain/models/Assessment.js';
import { featureToggles } from '../../../../../../src/shared/infrastructure/feature-toggles/index.js';
import { databaseBuilder, expect, knex, sinon } from '../../../../../test-helper.js';

const {
  buildUser,
  buildAssessment,
  buildOrganizationLearner,
  buildTargetProfile,
  buildBadge,
  buildCampaignParticipation,
  buildBadgeAcquisition,
  buildCampaign,
} = databaseBuilder.factory;

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
    let adminUserId;
    let campaignId;
    let campaignParticipationId;
    let certifiableBadge;
    let nonCertifiableBadge;
    let userId;

    beforeEach(async function () {
      // given
      adminUserId = buildUser().id;
      const targetProfileId = buildTargetProfile().id;
      nonCertifiableBadge = buildBadge({
        targetProfileId,
        isCertifiable: false,
      });
      certifiableBadge = buildBadge({
        targetProfileId,
        isCertifiable: true,
      });
      campaignId = buildCampaign({ targetProfileId }).id;
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
    });

    context('when feature toggle `isAnonymizationWithDeletionEnabled` is true', function () {
      it('should delete userId on non certifiable badgesAcquisitions', async function () {
        // given
        await featureToggles.set('isAnonymizationWithDeletionEnabled', true);

        // when
        await usecases.deleteCampaignParticipation({
          userId: adminUserId,
          campaignId,
          campaignParticipationId,
        });

        // then
        badgesAcquisitions = await knex('badge-acquisitions').where({
          campaignParticipationId,
        });
        const nonCertifiableBadgeAcquisition = badgesAcquisitions.find(
          (badgeAcquisition) => badgeAcquisition.badgeId === nonCertifiableBadge.id,
        );
        expect(nonCertifiableBadgeAcquisition.userId).to.be.null;
      });
    });

    context('when feature toggle `isAnonymizationWithDeletionEnabled` is false', function () {
      it('should not delete userId on non certifiable badgesAcquisitions', async function () {
        // given
        await featureToggles.set('isAnonymizationWithDeletionEnabled', false);

        // when
        await usecases.deleteCampaignParticipation({
          userId: adminUserId,
          campaignId,
          campaignParticipationId,
        });

        // then
        badgesAcquisitions = await knex('badge-acquisitions').where({
          campaignParticipationId,
        });
        const nonCertifiableBadgeAcquisition = badgesAcquisitions.find(
          (badgeAcquisition) => badgeAcquisition.badgeId === nonCertifiableBadge.id,
        );
        expect(nonCertifiableBadgeAcquisition.userId).to.equal(userId);
      });
    });

    it('should not delete userId on certifiable badgesAcquisitions', async function () {
      // when
      await usecases.deleteCampaignParticipation({
        userId: adminUserId,
        campaignId,
        campaignParticipationId,
      });

      // then
      badgesAcquisitions = await knex('badge-acquisitions').where({
        campaignParticipationId,
      });

      const certifiableBadgeAcquisition = badgesAcquisitions.find(
        (badgeAcquisition) => badgeAcquisition.badgeId === certifiableBadge.id,
      );
      expect(certifiableBadgeAcquisition.userId).to.equal(userId);
    });
  });

  context('when there is assessment linked to campaign participation', function () {
    let campaignId;
    let campaignParticipationId;
    let adminUserId;
    let userId;
    let assessment1;
    let organizationLearnerId;

    beforeEach(async function () {
      // given
      adminUserId = buildUser().id;
      campaignId = buildCampaign().id;
      userId = buildUser().id;
      organizationLearnerId = buildOrganizationLearner({ userId }).id;
      campaignParticipationId = buildCampaignParticipation({
        userId,
        campaignId,
        organizationLearnerId,
      }).id;
      assessment1 = buildAssessment({ userId, campaignParticipationId, type: Assessment.types.CAMPAIGN });
      await databaseBuilder.commit();
    });
    context('when feature toggle `isAnonymizationWithDeletionEnabled` is false', function () {
      it('should not detach assesmment', async function () {
        // given
        await featureToggles.set('isAnonymizationWithDeletionEnabled', false);

        // when
        await usecases.deleteCampaignParticipation({
          userId: adminUserId,
          campaignId,
          campaignParticipationId,
        });

        // then
        const assessmentInDb = await knex('assessments').where({ id: assessment1.id }).first();
        expect(assessmentInDb.campaignParticipationId).equal(campaignParticipationId);
      });
    });
    context('when feature toggle `isAnonymizationWithDeletionEnabled` is true', function () {
      it('should detach assessments', async function () {
        // given
        await featureToggles.set('isAnonymizationWithDeletionEnabled', true);
        const assessment2 = buildAssessment({
          userId,
          campaignParticipationId,
          type: Assessment.types.CAMPAIGN,
          isImproving: true,
        });
        const otherCampaignParticipationId = buildCampaignParticipation({
          organizationLearnerId,
          userId,
        }).id;
        const otherAssessment = buildAssessment({
          userId,
          campaignParticipationId: otherCampaignParticipationId,
          type: Assessment.types.CAMPAIGN,
          isImproving: true,
        });
        await databaseBuilder.commit();

        // when
        await usecases.deleteCampaignParticipation({
          userId: adminUserId,
          campaignId,
          campaignParticipationId,
        });

        // then
        const assessmentsInDb = await knex('assessments').whereIn('id', [assessment1.id, assessment2.id]);
        assessmentsInDb.forEach((assessment) => {
          expect(assessment.campaignParticipationId).null;
        });
        const otherAssessmentsInDb = await knex('assessments').where('id', otherAssessment.id).first();
        expect(otherAssessmentsInDb.campaignParticipationId).equal(otherAssessment.campaignParticipationId);
      });
    });
  });
});
