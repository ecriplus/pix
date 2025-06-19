import { USER_RECOMMENDED_TRAININGS_TABLE_NAME } from '../../../../../../db/migrations/20221017085933_create-user-recommended-trainings.js';
import { EventLoggingJob } from '../../../../../../src/identity-access-management/domain/models/jobs/EventLoggingJob.js';
import { usecases } from '../../../../../../src/prescription/campaign/domain/usecases/index.js';
import * as campaignAdministrationRepository from '../../../../../../src/prescription/campaign/infrastructure/repositories/campaign-administration-repository.js';
import { CampaignParticipationLoggerContext } from '../../../../../../src/prescription/shared/domain/constants.js';
import { CAMPAIGN_FEATURES } from '../../../../../../src/shared/domain/constants.js';
import { Assessment } from '../../../../../../src/shared/domain/models/Assessment.js';
import { featureToggles } from '../../../../../../src/shared/infrastructure/feature-toggles/index.js';
import { databaseBuilder, expect, knex, sinon } from '../../../../../test-helper.js';

const {
  buildAssessment,
  buildBadge,
  buildBadgeAcquisition,
  buildCampaign,
  buildCampaignParticipation,
  buildMembership,
  buildUserRecommendedTraining,
  buildOrganization,
  buildUser,
  buildTargetProfile,
  buildCampaignFeature,
  buildFeature,
} = databaseBuilder.factory;

describe('Integration | UseCases | delete-campaign', function () {
  describe('success case', function () {
    let clock;
    let now;

    beforeEach(function () {
      now = new Date('1992-07-07');
      clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
    });

    afterEach(async function () {
      clock.restore();
    });

    it('should not throw', async function () {
      // given
      const userId = buildUser().id;
      const organizationId = buildOrganization().id;
      buildMembership({ userId, organizationId, organizationRole: 'MEMBER' });
      const campaignId = buildCampaign({ ownerId: userId, organizationId }).id;
      buildCampaignParticipation({ campaignId });

      await databaseBuilder.commit();
      let error;
      try {
        await usecases.deleteCampaigns({ userId, organizationId, campaignIds: [campaignId] });
      } catch (e) {
        error = e;
      }

      // when & then
      expect(error).to.be.undefined;
    });

    it('should delete campaign for given id', async function () {
      // given
      const userId = buildUser().id;
      const organizationId = buildOrganization().id;
      buildMembership({ userId, organizationId, organizationRole: 'MEMBER' });
      const campaignId = buildCampaign({
        ownerId: userId,
        organizationId,
        name: 'nom de campagne',
        title: 'titre de campagne',
      }).id;

      await featureToggles.set('isAnonymizationWithDeletionEnabled', false);

      await databaseBuilder.commit();

      // when
      await usecases.deleteCampaigns({ userId, organizationId, campaignIds: [campaignId] });

      const updatedCampaign = await campaignAdministrationRepository.get(campaignId);

      // then
      expect(updatedCampaign.deletedAt).to.deep.equal(now);
      expect(updatedCampaign.deletedBy).to.equal(userId);
      expect(updatedCampaign.name).to.equal('nom de campagne');
      expect(updatedCampaign.title).to.equal('titre de campagne');

      await expect(EventLoggingJob.name).to.have.been.performed.withJobsCount(0);
    });

    it('should also anonymize campaign when flag is true', async function () {
      // given
      const userId = buildUser().id;
      const organizationId = buildOrganization().id;
      buildMembership({ userId, organizationId, organizationRole: 'MEMBER' });
      const campaignId = buildCampaign({
        ownerId: userId,
        organizationId,
        name: 'nom de campagne',
        title: 'titre de campagne',
      }).id;

      await featureToggles.set('isAnonymizationWithDeletionEnabled', true);

      await databaseBuilder.commit();

      // when
      await usecases.deleteCampaigns({ userId, organizationId, campaignIds: [campaignId] });

      const updatedCampaign = await campaignAdministrationRepository.get(campaignId);

      // then
      expect(updatedCampaign.deletedAt).to.deep.equal(now);
      expect(updatedCampaign.deletedBy).to.equal(userId);
      expect(updatedCampaign.name).to.equal('(anonymized)');
      expect(updatedCampaign.title).to.be.null;
    });

    context('when there are user-recommended-trainings linked to campaign participations', function () {
      let adminUserId, campaignParticipationId, userId, userRecommendedTrainingId, campaignId, organizationId;

      beforeEach(async function () {
        //given
        adminUserId = buildUser().id;
        userId = buildUser().id;
        organizationId = buildOrganization().id;
        buildMembership({ userId: adminUserId, organizationId, organizationRole: 'ADMIN' });
        campaignId = buildCampaign({ organizationId }).id;
        campaignParticipationId = buildCampaignParticipation({ userId, campaignId, organizationId }).id;
        userRecommendedTrainingId = buildUserRecommendedTraining({ userId, campaignParticipationId }).id;

        await databaseBuilder.commit();
      });
      context('when feature toggle `isAnonymizationWithDeletionEnabled` is true', function () {
        it('should delete campaignParticipationId', async function () {
          //given
          await featureToggles.set('isAnonymizationWithDeletionEnabled', true);

          //when
          await usecases.deleteCampaigns({
            userId: adminUserId,
            campaignIds: [campaignId],
            organizationId,
          });

          //then
          const userRecommendedTrainingAnonymized = await knex(USER_RECOMMENDED_TRAININGS_TABLE_NAME)
            .where('id', userRecommendedTrainingId)
            .first();

          expect(userRecommendedTrainingAnonymized.campaignParticipationId).to.be.null;
        });
      });

      context('when feature toggle `isAnonymizationWithDeletionEnabled` is false', function () {
        it('should not delete campaignParticipationId', async function () {
          //given
          await featureToggles.set('isAnonymizationWithDeletionEnabled', false);

          //when
          await usecases.deleteCampaigns({
            userId: adminUserId,
            campaignIds: [campaignId],
            organizationId,
          });

          //then
          const userRecommendedTrainingAnonymized = await knex(USER_RECOMMENDED_TRAININGS_TABLE_NAME)
            .where('id', userRecommendedTrainingId)
            .first();

          expect(userRecommendedTrainingAnonymized.campaignParticipationId).to.equal(campaignParticipationId);
        });
      });
    });

    context('With campaign participations', function () {
      let adminUserId;
      let campaignId;
      let organizationId;
      let userId;
      let campaignParticipationId;
      let organizationLearnerId;
      let targetProfileId;
      beforeEach(async function () {
        adminUserId = databaseBuilder.factory.buildUser().id;
        organizationId = buildOrganization().id;
        buildMembership({ userId: adminUserId, organizationId, organizationRole: 'ADMIN' });
        userId = databaseBuilder.factory.buildUser().id;
        targetProfileId = buildTargetProfile().id;
        campaignId = databaseBuilder.factory.buildCampaign({ organizationId, targetProfileId }).id;
        organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ userId, organizationId }).id;
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
          await usecases.deleteCampaigns({
            userId: adminUserId,
            campaignIds: [campaignId],
            organizationId,
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
            await usecases.deleteCampaigns({
              userId: adminUserId,
              campaignIds: [campaignId],
              organizationId,
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
            await usecases.deleteCampaigns({
              userId: adminUserId,
              campaignIds: [campaignId],
              organizationId,
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
            await usecases.deleteCampaigns({
              userId: adminUserId,
              campaignIds: [campaignId],
              organizationId,
            });

            // then
            const assessmentInDb = await knex('assessments').where({ id: assessment1.id }).first();
            expect(assessmentInDb.campaignParticipationId).equal(campaignParticipationId);
          });
        });

        it('should not publish an event to historize action', async function () {
          // when
          await usecases.deleteCampaigns({
            userId: adminUserId,
            campaignIds: [campaignId],
            organizationId,
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
          // when
          await usecases.deleteCampaigns({
            userId: adminUserId,
            campaignIds: [campaignId],
            organizationId,
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
          // when
          await usecases.deleteCampaigns({
            userId: adminUserId,
            campaignIds: [campaignId],
            organizationId,
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
            await usecases.deleteCampaigns({
              userId: adminUserId,
              campaignIds: [campaignId],
              organizationId,
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
              await usecases.deleteCampaigns({
                userId: adminUserId,
                campaignIds: [campaignId],
                organizationId,
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
            await usecases.deleteCampaigns({
              userId: adminUserId,
              campaignIds: [campaignId],
              organizationId,
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
            await usecases.deleteCampaigns({
              userId: adminUserId,
              campaignIds: [campaignId],
              organizationId,
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

    context('With external id campaign feature', function () {
      let campaignId;
      let adminUserId;
      let organizationId;

      beforeEach(async function () {
        const featureId = buildFeature({
          key: CAMPAIGN_FEATURES.EXTERNAL_ID.key,
        }).id;

        adminUserId = buildUser().id;
        organizationId = buildOrganization().id;
        buildMembership({ userId: adminUserId, organizationId, organizationRole: 'ADMIN' });
        campaignId = buildCampaign({ organizationId }).id;
        buildCampaignFeature({ campaignId, featureId, params: { label: 'External ID', type: 'email' } });

        await databaseBuilder.commit();
      });

      context('when feature toggle `isAnonymizationWithDeletionEnabled` is false', function () {
        beforeEach(async function () {
          await featureToggles.set('isAnonymizationWithDeletionEnabled', false);
        });

        it('should not empty external id label param', async function () {
          // when
          await usecases.deleteCampaigns({
            userId: adminUserId,
            campaignIds: [campaignId],
            organizationId,
          });

          // then
          const results = await knex('campaign-features').where({ campaignId });

          expect(results).to.have.lengthOf(1);
          expect(results[0].params).to.deep.equal({ type: 'email', label: 'External ID' });
        });
      });

      context('when feature toggle `isAnonymizationWithDeletionEnabled` is true', function () {
        beforeEach(async function () {
          await featureToggles.set('isAnonymizationWithDeletionEnabled', true);
        });

        it('should empty external id label param', async function () {
          // when
          await usecases.deleteCampaigns({
            userId: adminUserId,
            campaignIds: [campaignId],
            organizationId,
          });

          // then
          const results = await knex('campaign-features').where({ campaignId });

          expect(results).to.have.lengthOf(1);
          expect(results[0].params).to.not.have.property('label');
        });
      });
    });
  });
});
