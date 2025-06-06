import { EventLoggingJob } from '../../../../../../src/identity-access-management/domain/models/jobs/EventLoggingJob.js';
import { usecases } from '../../../../../../src/prescription/campaign/domain/usecases/index.js';
import * as campaignAdministrationRepository from '../../../../../../src/prescription/campaign/infrastructure/repositories/campaign-administration-repository.js';
import * as campaignParticipationRepository from '../../../../../../src/prescription/campaign-participation/infrastructure/repositories/campaign-participation-repository.js';
import { CampaignParticipationLoggerContext } from '../../../../../../src/prescription/shared/domain/constants.js';
import { featureToggles } from '../../../../../../src/shared/infrastructure/feature-toggles/index.js';
import { databaseBuilder, expect, sinon } from '../../../../../test-helper.js';

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
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      databaseBuilder.factory.buildMembership({ userId, organizationId, organizationRole: 'MEMBER' });
      const campaignId = databaseBuilder.factory.buildCampaign({ ownerId: userId, organizationId }).id;
      databaseBuilder.factory.buildCampaignParticipation({ campaignId });

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

    it('should delete campaign for given id and participation associated', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      databaseBuilder.factory.buildMembership({ userId, organizationId, organizationRole: 'MEMBER' });
      const campaignId = databaseBuilder.factory.buildCampaign({
        ownerId: userId,
        organizationId,
        name: 'nom de campagne',
        title: 'titre de campagne',
      }).id;
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        participantExternalId: 'externalId',
      });
      await featureToggles.set('isAnonymizationWithDeletionEnabled', false);

      await databaseBuilder.commit();

      // when
      await usecases.deleteCampaigns({ userId, organizationId, campaignIds: [campaignId] });

      const updatedCampaign = await campaignAdministrationRepository.get(campaignId);
      const updatedCampaignParticipation = await campaignParticipationRepository.get(campaignParticipationId.id);

      // then
      expect(updatedCampaign.deletedAt).to.deep.equal(now);
      expect(updatedCampaign.deletedBy).to.equal(userId);
      expect(updatedCampaign.name).to.equal('nom de campagne');
      expect(updatedCampaign.title).to.equal('titre de campagne');
      expect(updatedCampaignParticipation.participantExternalId).to.equal('externalId');
      expect(updatedCampaignParticipation.userId).to.equal(campaignParticipationId.userId);
      expect(updatedCampaignParticipation.deletedAt).to.deep.equal(now);
      expect(updatedCampaignParticipation.deletedBy).to.equal(userId);

      await expect(EventLoggingJob.name).to.have.been.performed.withJobsCount(0);
    });

    it('should also anonymize when flag is true', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      databaseBuilder.factory.buildMembership({ userId, organizationId, organizationRole: 'MEMBER' });
      const campaignId = databaseBuilder.factory.buildCampaign({
        ownerId: userId,
        organizationId,
        name: 'nom de campagne',
        title: 'titre de campagne',
      }).id;
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        participantExternalId: 'externalId',
      }).id;
      await featureToggles.set('isAnonymizationWithDeletionEnabled', true);

      await databaseBuilder.commit();

      // when
      await usecases.deleteCampaigns({ userId, organizationId, campaignIds: [campaignId] });

      const updatedCampaign = await campaignAdministrationRepository.get(campaignId);
      const updatedCampaignParticipation = await campaignParticipationRepository.get(campaignParticipationId);

      // then
      expect(updatedCampaign.deletedAt).to.deep.equal(now);
      expect(updatedCampaign.deletedBy).to.equal(userId);
      expect(updatedCampaign.name).to.equal('(anonymized)');
      expect(updatedCampaign.title).to.be.null;
      expect(updatedCampaignParticipation.deletedAt).to.deep.equal(now);
      expect(updatedCampaignParticipation.deletedBy).to.equal(userId);
      expect(updatedCampaignParticipation.participantExternalId).to.be.null;
      expect(updatedCampaignParticipation.userId).to.be.null;

      await expect(EventLoggingJob.name).to.have.been.performed.withJobPayload({
        client: 'PIX_ORGA',
        action: CampaignParticipationLoggerContext.DELETION,
        role: 'ORGA_ADMIN',
        userId: userId,
        occurredAt: now.toISOString(),
        targetUserId: campaignParticipationId,
        data: {},
      });
    });
  });
});
