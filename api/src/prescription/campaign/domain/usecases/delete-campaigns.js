import { EventLoggingJob } from '../../../../identity-access-management/domain/models/jobs/EventLoggingJob.js';
import { MembershipNotFound } from '../../../../team/application/api/errors/MembershipNotFound.js';
import { CampaignsDestructor } from '../models/CampaignsDestructor.js';

const deleteCampaigns = async ({
  userId,
  organizationId,
  campaignIds,
  featureToggles,
  adminMemberRepository,
  assessmentRepository,
  badgeAcquisitionRepository,
  organizationMembershipRepository,
  campaignAdministrationRepository,
  campaignParticipationRepository,
  userRecommendedTrainingRepository,
  eventLoggingJobRepository,
}) => {
  let membership;

  try {
    membership = await organizationMembershipRepository.getByUserIdAndOrganizationId({ userId, organizationId });
  } catch (error) {
    if (!(error instanceof MembershipNotFound)) {
      throw error;
    }
  }
  const pixAdminMember = await adminMemberRepository.get({ userId });

  const campaignsToDelete = await campaignAdministrationRepository.getByIds(campaignIds);
  const campaignParticipationsToDelete = await campaignParticipationRepository.getByCampaignIds(campaignIds);

  const isAnonymizationWithDeletionEnabled = await featureToggles.get('isAnonymizationWithDeletionEnabled');

  const campaignDestructor = new CampaignsDestructor({
    campaignsToDelete,
    campaignParticipationsToDelete,
    userId,
    organizationId,
    membership,
    pixAdminRole: pixAdminMember?.role,
  });
  campaignDestructor.delete(isAnonymizationWithDeletionEnabled);

  for (const campaignParticipation of campaignDestructor.campaignParticipations) {
    await campaignParticipationRepository.update(campaignParticipation);

    if (isAnonymizationWithDeletionEnabled) {
      await eventLoggingJobRepository.performAsync(
        new EventLoggingJob({
          client: 'PIX_ORGA',
          action: campaignParticipation.loggerContext,
          role: 'ORGA_ADMIN',
          userId: userId,
          targetUserId: campaignParticipation.id,
          data: {},
        }),
      );
    }
  }

  if (isAnonymizationWithDeletionEnabled) {
    const campaignParticipationIds = campaignParticipationsToDelete.map(({ id }) => id);

    await userRecommendedTrainingRepository.deleteCampaignParticipationIds({
      campaignParticipationIds,
    });
    await badgeAcquisitionRepository.deleteUserIdOnNonCertifiableBadgesForCampaignParticipations(
      campaignParticipationIds,
    );
    const assessments = await assessmentRepository.getByCampaignParticipationIds(campaignParticipationIds);
    for (const assessment of assessments) {
      assessment.detachCampaignParticipation();
      await assessmentRepository.updateCampaignParticipationId(assessment);
    }

    const campaignIdsToDelete = campaignDestructor.campaigns.map(({ id }) => id);

    await campaignAdministrationRepository.deleteExternalIdLabelFromCampaigns(campaignIdsToDelete);
  }

  await campaignAdministrationRepository.remove(campaignsToDelete);
};

export { deleteCampaigns };
