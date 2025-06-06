import { EventLoggingJob } from '../../../../../../src/identity-access-management/domain/models/jobs/EventLoggingJob.js';
import { usecases } from '../../../../../../src/prescription/campaign-participation/domain/usecases/index.js';
import { CampaignParticipationLoggerContext } from '../../../../../../src/prescription/shared/domain/constants.js';
import { Assessment } from '../../../../../../src/shared/domain/models/Assessment.js';
import { featureToggles } from '../../../../../../src/shared/infrastructure/feature-toggles/index.js';
import { databaseBuilder, expect, knex, sinon } from '../../../../../test-helper.js';

const { buildAssessment, buildTargetProfile, buildBadge, buildCampaignParticipation, buildBadgeAcquisition } =
  databaseBuilder.factory;

describe('Integration | UseCases | delete-campaign-participation', function () {
  let clock, now;
  let adminUserId;
  let campaignId;
  let userId;
  let campaignParticipationId;
  let organizationLearnerId;
  let targetProfileId;

  beforeEach(async function () {
    now = new Date('2023-03-03');
    clock = sinon.useFakeTimers({ now, toFake: ['Date'] });

    adminUserId = databaseBuilder.factory.buildUser().id;
    userId = databaseBuilder.factory.buildUser().id;
    targetProfileId = buildTargetProfile().id;
    campaignId = databaseBuilder.factory.buildCampaign({ targetProfileId }).id;
    organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ userId }).id;
    campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
      isImproved: false,
      organizationLearnerId,
      userId,
      deletedAt: null,
      deletedBy: null,
      participantExternalId: 'email olala',
      campaignId,
    }).id;

    await databaseBuilder.commit();
  });

  afterEach(function () {
    clock.restore();
  });

  context('when feature toggle `isAnonymizationWithDeletionEnabled` is false', function () {
    beforeEach(async function () {
      await featureToggles.set('isAnonymizationWithDeletionEnabled', false);
    });

    it('should delete all campaignParticipations', async function () {
      // given

      databaseBuilder.factory.buildCampaignParticipation({
        isImproved: true,
        participantExternalId: 'email olala',
        organizationLearnerId,
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
        campaignParticipationId,
        userRole: 'ORGA_ADMIN',
        client: 'PIX_ORGA',
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

    context('when there are badges linked to the campaign participations', function () {
      let badgesAcquisitions;
      let certifiableBadge;
      let nonCertifiableBadge;

      beforeEach(async function () {
        // given

        nonCertifiableBadge = buildBadge({
          targetProfileId,
          isCertifiable: false,
        });
        certifiableBadge = buildBadge({
          targetProfileId,
          isCertifiable: true,
        });

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

      it('should not delete userId on non certifiable badgesAcquisitions', async function () {
        // given
        await featureToggles.set('isAnonymizationWithDeletionEnabled', false);

        // when
        await usecases.deleteCampaignParticipation({
          userId: adminUserId,
          campaignId,
          campaignParticipationId,
          userRole: 'ORGA_ADMIN',
          client: 'PIX_ORGA',
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

      it('should not delete userId on certifiable badgesAcquisitions', async function () {
        // when
        await usecases.deleteCampaignParticipation({
          userId: adminUserId,
          campaignId,
          campaignParticipationId,
          userRole: 'ORGA_ADMIN',
          client: 'PIX_ORGA',
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
      it('should not detach assesmment', async function () {
        // given
        const assessment1 = buildAssessment({ userId, campaignParticipationId, type: Assessment.types.CAMPAIGN });

        await databaseBuilder.commit();

        // when
        await usecases.deleteCampaignParticipation({
          userId: adminUserId,
          campaignId,
          campaignParticipationId,
          userRole: 'ORGA_ADMIN',
          client: 'PIX_ORGA',
        });

        // then
        const assessmentInDb = await knex('assessments').where({ id: assessment1.id }).first();
        expect(assessmentInDb.campaignParticipationId).equal(campaignParticipationId);
      });
    });

    it('should not publish an event to historize action', async function () {
      // when
      await usecases.deleteCampaignParticipation({
        userId: adminUserId,
        campaignId,
        campaignParticipationId,
        userRole: 'ORGA_ADMIN',
        client: 'PIX_ORGA',
      });

      // then
      await expect(EventLoggingJob.name).to.have.been.performed.withJobsCount(0);
    });
  });

  context('when feature toggle `isAnonymizationWithDeletionEnabled` is true', function () {
    beforeEach(async function () {
      await featureToggles.set('isAnonymizationWithDeletionEnabled', true);
    });

    it('should delete all campaignParticipations with anonymization', async function () {
      // given

      databaseBuilder.factory.buildCampaignParticipation({
        isImproved: true,
        participantExternalId: 'email olala',
        organizationLearnerId,
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
        campaignParticipationId,
        userRole: 'ORGA_ADMIN',
        client: 'PIX_ORGA',
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

    it('should publish an event to historize action', async function () {
      // when
      await usecases.deleteCampaignParticipation({
        userId: adminUserId,
        campaignId,
        campaignParticipationId,
        userRole: 'ORGA_ADMIN',
        client: 'PIX_ORGA',
      });

      // then
      await expect(EventLoggingJob.name).to.have.been.performed.withJobPayload({
        client: 'PIX_ORGA',
        action: CampaignParticipationLoggerContext.DELETION,
        role: 'ORGA_ADMIN',
        userId: adminUserId,
        occurredAt: now.toISOString(),
        targetUserId: campaignParticipationId,
        data: {},
      });
    });

    context('when there are badges linked to the campaign participations', function () {
      let badgesAcquisitions;
      let certifiableBadge;
      let nonCertifiableBadge;

      beforeEach(async function () {
        // given
        nonCertifiableBadge = buildBadge({
          targetProfileId,
          isCertifiable: false,
        });
        certifiableBadge = buildBadge({
          targetProfileId,
          isCertifiable: true,
        });

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

      it('should delete userId on non certifiable badgesAcquisitions', async function () {
        // given
        await featureToggles.set('isAnonymizationWithDeletionEnabled', true);

        // when
        await usecases.deleteCampaignParticipation({
          userId: adminUserId,
          campaignId,
          campaignParticipationId,
          userRole: 'ORGA_ADMIN',
          client: 'PIX_ORGA',
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

      context('when feature toggle `isAnonymizationWithDeletionEnabled` is false', function () {
        it('should not delete userId on non certifiable badgesAcquisitions', async function () {
          // given
          await featureToggles.set('isAnonymizationWithDeletionEnabled', false);

          // when
          await usecases.deleteCampaignParticipation({
            userId: adminUserId,
            campaignId,
            campaignParticipationId,
            userRole: 'ORGA_ADMIN',
            client: 'PIX_ORGA',
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
          userRole: 'ORGA_ADMIN',
          client: 'PIX_ORGA',
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
      it('should detach assessments', async function () {
        // given
        const assessment1 = buildAssessment({ userId, campaignParticipationId, type: Assessment.types.CAMPAIGN });

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
          userRole: 'ORGA_ADMIN',
          client: 'PIX_ORGA',
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
