import { CLIENTS, PIX_ORGA } from '../../../../authorization/domain/constants.js';
import * as CombinedCourseRepository from '../../../../quest/infrastructure/repositories/combined-course-repository.js';
import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { EventLoggingJob } from '../../../../shared/domain/models/jobs/EventLoggingJob.js';
import { CampaignBelongsToCombinedCourseError } from '../errors.js';
import { CampaignsDestructor } from '../models/CampaignsDestructor.js';

const deleteCampaigns = withTransaction(
  async ({
    userId,
    organizationId,
    campaignIds,
    adminMemberRepository,
    assessmentRepository,
    badgeAcquisitionRepository,
    organizationMembershipRepository,
    campaignAdministrationRepository,
    campaignParticipationRepository,
    userRecommendedTrainingRepository,
    eventLoggingJobRepository,
    client,
    userRole,
    keepPreviousDeletion = false,
    isPartOfDeletingCombinedCourse = false,
  }) => {
    let membership;
    let pixAdminRole = userRole;

    if (!pixAdminRole) {
      const pixAdminMember = await adminMemberRepository.get({ userId });
      pixAdminRole = pixAdminMember?.role;
      if (!pixAdminRole) {
        membership = await organizationMembershipRepository.getByUserIdAndOrganizationId({ userId, organizationId });
      }
    }

    for (const campaignId of campaignIds) {
      const combinedCourses = await CombinedCourseRepository.findByCampaignId({ campaignId });
      if (combinedCourses.length > 0 && !isPartOfDeletingCombinedCourse) {
        throw new CampaignBelongsToCombinedCourseError();
      }
    }

    const campaignsToDelete = await campaignAdministrationRepository.findByIds(campaignIds);
    const campaignParticipationsToDelete = await campaignParticipationRepository.getByCampaignIds(campaignIds, {
      withDeletedParticipation: keepPreviousDeletion,
    });

    const campaignDestructor = new CampaignsDestructor({
      campaignsToDelete,
      campaignParticipationsToDelete,
      userId,
      organizationId,
      membership,
      pixAdminRole,
    });
    campaignDestructor.delete({ keepPreviousDeletion });

    for (const campaignParticipation of campaignDestructor.campaignParticipations) {
      await campaignParticipationRepository.update(campaignParticipation);

      await eventLoggingJobRepository.performAsync(
        EventLoggingJob.forUser({
          client: client ?? CLIENTS.ORGA,
          action: campaignParticipation.loggerContext,
          role: userRole ?? PIX_ORGA.ROLES.ADMIN,
          userId: campaignParticipation.id,
          updatedByUserId: userId,
          data: {},
        }),
      );
    }

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

    await campaignAdministrationRepository.remove(campaignsToDelete);
  },
);

export { deleteCampaigns };
