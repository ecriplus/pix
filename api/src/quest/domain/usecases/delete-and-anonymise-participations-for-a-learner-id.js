import { CLIENTS, PIX_ADMIN } from '../../../authorization/domain/constants.js';
import { withTransaction } from '../../../shared/domain/DomainTransaction.js';

export const deleteAndAnonymizeParticipationsForALearnerId = withTransaction(
  async ({
    organizationLearnerParticipationRepository,
    campaignRepository,
    combinedCourseId,
    userId,
    organizationLearnerId,
    combinedCourseDetailsService,
    campaignParticipationRepository,
  }) => {
    await organizationLearnerParticipationRepository.deleteCombinedCourseParticipationByCombinedCourseIdAndOrganizationLearnerId(
      { combinedCourseId, userId, organizationLearnerId },
    );
    const campaignIds = await campaignRepository.getCampaignIdsByCombinedCourseIds({
      combinedCourseIds: [combinedCourseId],
    });

    const modulesIdsToDelete = [];

    const { modules } = await combinedCourseDetailsService.instantiateCombinedCourseDetails({
      combinedCourseId,
    });
    modulesIdsToDelete.push(...modules.map((module) => module.id));

    await organizationLearnerParticipationRepository.deletePassagesByModuleIdsAndOrganizationLearnerId({
      moduleIds: modulesIdsToDelete,
      organizationLearnerId,
      userId,
    });

    for (const campaignId of campaignIds) {
      const campaignParticipations =
        await campaignParticipationRepository.getCampaignParticipationsByLearnerIdAndCampaignId({
          organizationLearnerId,
          campaignId,
        });
      const campaignParticipationIds = campaignParticipations.map((campaignParticipation) => campaignParticipation.id);
      await campaignParticipationRepository.deleteCampaignParticipationsInCombinedCourse({
        userId,
        campaignId: campaignId,
        campaignParticipationIds,
        userRole: PIX_ADMIN.ROLES.SUPER_ADMIN,
        client: CLIENTS.SCRIPT,
      });
    }
  },
);
