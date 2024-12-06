import { CampaignParticipationForUserManagement } from '../../../../../../src/prescription/campaign-participation/domain/models/CampaignParticipationForUserManagement.js';
import * as participationsForUserManagementRepository from '../../../../../../src/prescription/campaign-participation/infrastructure/repositories/participations-for-user-management-repository.js';
import { CampaignParticipationStatuses } from '../../../../../../src/prescription/shared/domain/constants.js';
import { Assessment } from '../../../../../../src/shared/domain/models/Assessment.js';
import { databaseBuilder, expect } from '../../../../../test-helper.js';

const { SHARED } = CampaignParticipationStatuses;

describe('Integration | Repository | Participations-For-User-Management', function () {
  describe('#findByUserId', function () {
    let userId;

    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();
    });

    context('when the given user has no participations', function () {
      it('should return an empty array', async function () {
        // given
        const participation = databaseBuilder.factory.buildCampaignParticipation();
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participation.id,
          userId: participation.userId,
          type: Assessment.types.CAMPAIGN,
        });
        await databaseBuilder.commit();

        // when
        const participationsForUserManagement = await participationsForUserManagementRepository.findByUserId(userId);

        // then
        expect(participationsForUserManagement).to.be.empty;
      });
    });

    context('when the given user has participations', function () {
      it('should return only participations for given user', async function () {
        // given
        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          participantExternalId: 'special',
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: campaignParticipation.id,
          type: Assessment.types.CAMPAIGN,
          userId,
        });

        const otherUserId = databaseBuilder.factory.buildUser().id;
        const otherParticipation = databaseBuilder.factory.buildCampaignParticipation({
          userId: otherUserId,
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: otherParticipation.id,
          type: Assessment.types.CAMPAIGN,
          userId: otherUserId,
        });
        await databaseBuilder.commit();

        // when
        const participationsForUserManagement = await participationsForUserManagementRepository.findByUserId(userId);

        // then
        expect(participationsForUserManagement).to.have.lengthOf(1);
        expect(participationsForUserManagement[0].participantExternalId).to.equal(
          campaignParticipation.participantExternalId,
        );
      });

      it('should return participations with all attributes', async function () {
        // given
        const campaign = databaseBuilder.factory.buildCampaign({ code: 'FUNCODE' });
        const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
          firstName: 'Blanche',
          lastName: 'Isserie',
          userId,
        });
        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          organizationLearnerId: organizationLearner.id,
          campaignId: campaign.id,
          participantExternalId: '123',
          status: SHARED,
          createdAt: new Date('2010-10-10'),
          sharedAt: new Date('2010-10-11'),
        });
        const assessment = databaseBuilder.factory.buildAssessment({
          campaignParticipationId: campaignParticipation.id,
          type: Assessment.types.CAMPAIGN,
          userId,
        });
        await databaseBuilder.commit();

        // when
        const participationsForUserManagement = await participationsForUserManagementRepository.findByUserId(userId);

        // then
        expect(participationsForUserManagement[0]).to.be.instanceOf(CampaignParticipationForUserManagement);
        expect(participationsForUserManagement[0]).to.deep.includes({
          id: assessment.id,
          campaignParticipationId: campaignParticipation.id,
          participantExternalId: campaignParticipation.participantExternalId,
          status: campaignParticipation.status,
          createdAt: assessment.createdAt,
          sharedAt: campaignParticipation.sharedAt,
          campaignId: campaign.id,
          campaignCode: campaign.code,
          organizationLearnerFullName: `${organizationLearner.firstName} ${organizationLearner.lastName}`,
        });
      });

      context('When a participation is deleted', function () {
        it('should return participation with deletion attributes', async function () {
          // given
          const deletingUser = databaseBuilder.factory.buildUser({ id: 666, firstName: 'The', lastName: 'Terminator' });
          const campaign = databaseBuilder.factory.buildCampaign({ code: 'FUNCODE' });
          const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
            firstName: 'Blanche',
            lastName: 'Isserie',
            userId,
          });
          const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
            userId,
            organizationLearnerId: organizationLearner.id,
            campaignId: campaign.id,
            participantExternalId: '123',
            status: SHARED,
            createdAt: new Date('2010-10-10'),
            sharedAt: new Date('2010-10-11'),
            deletedAt: new Date('2010-10-12'),
            deletedBy: deletingUser.id,
          });
          const assessment = databaseBuilder.factory.buildAssessment({
            campaignParticipationId: campaignParticipation.id,
            type: Assessment.types.CAMPAIGN,
            userId,
            updatedAt: new Date('2010-10-10'),
          });
          await databaseBuilder.commit();

          // when
          const participationsForUserManagement = await participationsForUserManagementRepository.findByUserId(userId);

          // then
          expect(participationsForUserManagement[0]).to.deep.includes({
            id: assessment.id,
            campaignParticipationId: campaignParticipation.id,
            participantExternalId: campaignParticipation.participantExternalId,
            status: SHARED,
            createdAt: assessment.createdAt,
            sharedAt: campaignParticipation.sharedAt,
            campaignId: campaign.id,
            campaignCode: campaign.code,
            deletedAt: campaignParticipation.deletedAt,
            organizationLearnerFullName: `${organizationLearner.firstName} ${organizationLearner.lastName}`,
          });
        });

        it('should return participation is deleted and anonymized', async function () {
          // given
          const assessment = databaseBuilder.factory.buildAssessment({
            type: Assessment.types.CAMPAIGN,
            userId,
            updatedAt: new Date('2010-10-12'),
          });
          await databaseBuilder.commit();

          // when
          const participationsForUserManagement = await participationsForUserManagementRepository.findByUserId(userId);

          // then
          expect(participationsForUserManagement[0]).to.deep.includes({
            id: assessment.id,
            campaignParticipationId: null,
            participantExternalId: null,
            status: null,
            createdAt: assessment.createdAt,
            sharedAt: null,
            campaignId: null,
            campaignCode: null,
            deletedAt: assessment.updatedAt,
            organizationLearnerFullName: '-',
          });
        });
      });

      it('should sort participations by descending createdAt', async function () {
        const campaign1 = databaseBuilder.factory.buildCampaign();
        const campaign2 = databaseBuilder.factory.buildCampaign();
        const campaign3 = databaseBuilder.factory.buildCampaign();

        // given
        const participationToCampaign1InJanuary = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId: campaign1.id,
          participantExternalId: 'Created-January',
          createdAt: new Date('2024-01-01'),
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participationToCampaign1InJanuary.id,
          type: Assessment.types.CAMPAIGN,
          userId,
        });
        const participationToCampaign2InFebruary = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId: campaign2.id,
          participantExternalId: 'Created-February',
          createdAt: new Date('2024-02-01'),
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participationToCampaign2InFebruary.id,
          type: Assessment.types.CAMPAIGN,
          userId,
        });
        const participationToCampaign3InMarch = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId: campaign3.id,
          participantExternalId: 'Created-March',
          createdAt: new Date('2024-03-01'),
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participationToCampaign3InMarch.id,
          type: Assessment.types.CAMPAIGN,
          userId,
        });
        await databaseBuilder.commit();

        // when
        const participationsForUserManagement = await participationsForUserManagementRepository.findByUserId(userId);

        // then
        expect(participationsForUserManagement[0].campaignParticipationId).to.equal(participationToCampaign3InMarch.id);
        expect(participationsForUserManagement[1].campaignParticipationId).to.equal(
          participationToCampaign2InFebruary.id,
        );
        expect(participationsForUserManagement[2].campaignParticipationId).to.equal(
          participationToCampaign1InJanuary.id,
        );
      });

      it('should sort participations by ascending campaign code when createdAt is the same', async function () {
        const campaignA = databaseBuilder.factory.buildCampaign({ code: 'AAAAAAA' });
        const campaignB = databaseBuilder.factory.buildCampaign({ code: 'BBBBBBB' });
        const campaignC = databaseBuilder.factory.buildCampaign({ code: 'CCCCCCC' });

        // given
        const participationToCampaignC = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId: campaignC.id,
          createdAt: new Date('2020-01-02'),
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participationToCampaignC.id,
          type: Assessment.types.CAMPAIGN,
          userId,
        });
        const participationToCampaignB = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId: campaignB.id,
          createdAt: new Date('2020-01-02'),
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participationToCampaignB.id,
          type: Assessment.types.CAMPAIGN,
          userId,
        });
        const participationToCampaignA = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId: campaignA.id,
          createdAt: new Date('2020-01-02'),
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participationToCampaignA.id,
          type: Assessment.types.CAMPAIGN,
          userId,
        });
        await databaseBuilder.commit();

        // when
        const participationsForUserManagement = await participationsForUserManagementRepository.findByUserId(userId);

        // then
        expect(participationsForUserManagement[0].campaignParticipationId).to.equal(participationToCampaignA.id);
        expect(participationsForUserManagement[1].campaignParticipationId).to.equal(participationToCampaignB.id);
        expect(participationsForUserManagement[2].campaignParticipationId).to.equal(participationToCampaignC.id);
      });

      it('should sort participations by descending sharedAt when createdAt is the same and campaign code is the same', async function () {
        const campaign = databaseBuilder.factory.buildCampaign();
        // given
        const participationSharedInJanuary = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId: campaign.id,
          participantExternalId: 'Shared-January',
          createdAt: new Date('2020-01-02'),
          sharedAt: new Date('2023-01-01'),
          isImproved: true,
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participationSharedInJanuary.id,
          type: Assessment.types.CAMPAIGN,
          userId,
        });
        const participationSharedInFebruary = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId: campaign.id,
          participantExternalId: 'Shared-February',
          createdAt: new Date('2020-01-02'),
          sharedAt: new Date('2023-02-01'),
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participationSharedInFebruary.id,
          type: Assessment.types.CAMPAIGN,
          userId,
        });
        const participationSharedInMarch = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId: campaign.id,
          participantExternalId: 'Shared-March',
          createdAt: new Date('2020-01-02'),
          sharedAt: new Date('2023-03-01'),
          isImproved: true,
        });
        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: participationSharedInMarch.id,
          type: Assessment.types.CAMPAIGN,
          userId,
        });
        await databaseBuilder.commit();

        // when
        const participationsForUserManagement = await participationsForUserManagementRepository.findByUserId(userId);

        // then
        expect(participationsForUserManagement[0].campaignParticipationId).to.equal(participationSharedInMarch.id);
        expect(participationsForUserManagement[1].campaignParticipationId).to.equal(participationSharedInFebruary.id);
        expect(participationsForUserManagement[2].campaignParticipationId).to.equal(participationSharedInJanuary.id);
      });
    });
  });
});
