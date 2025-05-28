import { usecases } from '../../../../../../src/prescription/learner-management/domain/usecases/index.js';
import { CampaignTypes } from '../../../../../../src/prescription/shared/domain/constants.js';
import { featureToggles } from '../../../../../../src/shared/infrastructure/feature-toggles/index.js';
import { databaseBuilder, expect, knex, sinon } from '../../../../../test-helper.js';

describe('Integration | UseCase | Organization Learners Management | Delete Organization Learners', function () {
  let organizationId;
  let campaign;
  let organizationLearner1, organizationLearner2;
  let campaignParticipation1;
  const participantExternalId = 'foo';
  let adminUserId;
  let now, clock;

  beforeEach(async function () {
    adminUserId = databaseBuilder.factory.buildUser().id;
    organizationId = databaseBuilder.factory.buildOrganization().id;
    campaign = databaseBuilder.factory.buildCampaign({ organizationId, type: CampaignTypes.ASSESSMENT });
    organizationLearner1 = databaseBuilder.factory.buildOrganizationLearner({
      organizationId,
      firstName: 'POUET',
      birthdate: '2020-05-12',
    });
    organizationLearner2 = databaseBuilder.factory.buildOrganizationLearner({
      organizationId,
      firstName: 'TEUOP',
      birthdate: '2020-12-12',
    });
    campaignParticipation1 = databaseBuilder.factory.buildCampaignParticipation({
      organizationLearnerId: organizationLearner1.id,
      participantExternalId,
      userId: organizationLearner1.userId,
    });
    databaseBuilder.factory.buildCampaignParticipation({
      organizationLearnerId: organizationLearner1.id,
      participantExternalId,
      isImproved: true,
      userId: organizationLearner1.userId,
    });
    await databaseBuilder.commit();

    now = new Date(2023, 3, 3);
    clock = sinon.useFakeTimers(now, 'Date');
  });

  afterEach(function () {
    clock.restore();
  });
  context('when feature toggle `isAnonymizationWithDeletionEnabled` is false', function () {
    it('should delete given organizationLearners with their related participations', async function () {
      // given
      await featureToggles.set('isAnonymizationWithDeletionEnabled', false);
      databaseBuilder.factory.buildOrganizationLearner({ organizationId });
      await databaseBuilder.commit();

      // when
      await usecases.deleteOrganizationLearners({
        userId: adminUserId,
        organizationLearnerIds: [organizationLearner1.id, organizationLearner2.id],
        organizationId,
      });

      // then
      const deletedLearners = await knex('organization-learners').whereIn('id', [
        organizationLearner1.id,
        organizationLearner2.id,
      ]);
      expect(deletedLearners).lengthOf(2);
      deletedLearners.forEach((learner) => {
        expect(learner.deletedAt).to.deep.equal(now);
        expect(learner.deletedBy).to.deep.equal(adminUserId);
      });

      const results = await knex('campaign-participations').where({ organizationLearnerId: organizationLearner1.id });
      expect(results).to.have.lengthOf(2);
      results.forEach((campaignParticipaton) => {
        expect(campaignParticipaton.participantExternalId).not.to.equal(null);
        expect(campaignParticipaton.userId).to.equal(organizationLearner1.userId);
        expect(campaignParticipaton.deletedAt).to.deep.equal(now);
        expect(campaignParticipaton.deletedBy).to.equal(adminUserId);
      });
    });
  });

  context('when feature toggle `isAnonymizationWithDeletionEnabled` is true', function () {
    it('should delete and anonymize all campaignParticipations', async function () {
      // given
      await featureToggles.set('isAnonymizationWithDeletionEnabled', true);
      databaseBuilder.factory.buildOrganizationLearner({ organizationId });

      await databaseBuilder.commit();

      // when
      await usecases.deleteOrganizationLearners({
        userId: adminUserId,
        organizationLearnerIds: [organizationLearner1.id, organizationLearner2.id],
        organizationId,
      });

      // then
      const deletedLearners = await knex('organization-learners').whereIn('id', [
        organizationLearner1.id,
        organizationLearner2.id,
      ]);
      expect(deletedLearners).lengthOf(2);
      deletedLearners.forEach((learner) => {
        expect(learner.firstName).to.equal('(anonymized)');
        expect(learner.lastName).to.equal('(anonymized)');
        expect(learner.preferredLastName).null;
        expect(learner.middleName).null;
        expect(learner.thirdName).null;
        expect(learner.birthdate).equal('2020-01-01');
        expect(learner.birthCity).null;
        expect(learner.birthCityCode).null;
        expect(learner.birthProvinceCode).null;
        expect(learner.birthCountryCode).null;
        expect(learner.status).null;
        expect(learner.nationalStudentId).null;
        expect(learner.nationalApprenticeId).null;
        expect(learner.division).null;
        expect(learner.sex).null;
        expect(learner.email).null;
        expect(learner.studentNumber).null;
        expect(learner.department).null;
        expect(learner.educationalTeam).null;
        expect(learner.group).null;
        expect(learner.diploma).null;
        expect(learner.userId).null;
        expect(learner.isDisabled).equal(false);
        expect(learner.updatedAt).deep.equal(now);
        expect(learner.deletedAt).deep.equal(now);
        expect(learner.deletedBy).to.deep.equal(adminUserId);
      });

      const results = await knex('campaign-participations').where({ organizationLearnerId: organizationLearner1.id });
      expect(results).to.have.lengthOf(2);
      results.forEach((campaignParticipaton) => {
        expect(campaignParticipaton.userId).to.equal(null);
        expect(campaignParticipaton.participantExternalId).to.equal(null);
        expect(campaignParticipaton.deletedAt).to.deep.equal(now);
        expect(campaignParticipaton.deletedBy).to.equal(adminUserId);
      });
    });
  });

  context('when there are badges linked to the campaign participations', function () {
    let badgesAcquisitions;
    let certifiableBadge;
    let nonCertifiableBadge;

    beforeEach(async function () {
      // given
      nonCertifiableBadge = databaseBuilder.factory.buildBadge({
        targetProfileId: campaign.targetProfileId,
        isCertifiable: false,
      });
      certifiableBadge = databaseBuilder.factory.buildBadge({
        targetProfileId: campaign.targetProfileId,
        isCertifiable: true,
      });

      databaseBuilder.factory.buildBadgeAcquisition({
        badgeId: certifiableBadge.id,
        campaignParticipationId: campaignParticipation1.id,
        userId: campaignParticipation1.userId,
      });
      databaseBuilder.factory.buildBadgeAcquisition({
        badgeId: nonCertifiableBadge.id,
        campaignParticipationId: campaignParticipation1.id,
        userId: campaignParticipation1.userId,
      });

      await databaseBuilder.commit();
    });

    context('when feature toggle `isAnonymizationWithDeletionEnabled` is true', function () {
      it('should delete userId on non certifiable badgesAcquisitions', async function () {
        // given
        await featureToggles.set('isAnonymizationWithDeletionEnabled', true);

        // when
        await usecases.deleteOrganizationLearners({
          userId: adminUserId,
          organizationLearnerIds: [organizationLearner1.id, organizationLearner2.id],
          organizationId,
        });

        // then
        badgesAcquisitions = await knex('badge-acquisitions').where({
          campaignParticipationId: campaignParticipation1.id,
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
        await usecases.deleteOrganizationLearners({
          userId: adminUserId,
          organizationLearnerIds: [organizationLearner1.id, organizationLearner2.id],
          organizationId,
        });

        // then
        badgesAcquisitions = await knex('badge-acquisitions').where({
          campaignParticipationId: campaignParticipation1.id,
        });
        const nonCertifiableBadgeAcquisition = badgesAcquisitions.find(
          (badgeAcquisition) => badgeAcquisition.badgeId === nonCertifiableBadge.id,
        );
        expect(nonCertifiableBadgeAcquisition.userId).to.equal(campaignParticipation1.userId);
      });
    });

    it('should not delete userId on certifiable badgesAcquisitions', async function () {
      // when
      await usecases.deleteOrganizationLearners({
        userId: adminUserId,
        organizationLearnerIds: [organizationLearner1.id, organizationLearner2.id],
        organizationId,
      });

      // then
      badgesAcquisitions = await knex('badge-acquisitions').where({
        campaignParticipationId: campaignParticipation1.id,
      });

      const certifiableBadgeAcquisition = badgesAcquisitions.find(
        (badgeAcquisition) => badgeAcquisition.badgeId === certifiableBadge.id,
      );
      expect(certifiableBadgeAcquisition.userId).to.equal(campaignParticipation1.userId);
    });
  });
});
