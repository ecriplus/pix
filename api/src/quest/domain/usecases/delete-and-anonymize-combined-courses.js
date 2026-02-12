import { CLIENTS, PIX_ADMIN } from '../../../authorization/domain/constants.js';
import { withTransaction } from '../../../shared/domain/DomainTransaction.js';

export const deleteAndAnonymizeCombinedCourses = withTransaction(
  async ({
    combinedCourseRepository,
    organizationLearnerParticipationRepository,
    campaignRepository,
    combinedCourseIds,
    userId,
    combinedCourseDetailsService,
  }) => {
    await combinedCourseRepository.deleteCombinedCourses({
      combinedCourseIds,
      deletedBy: userId,
    });
    await organizationLearnerParticipationRepository.deleteCombinedCourseParticipations({ combinedCourseIds, userId });
    const campaignIds = await campaignRepository.getCampaignIdsByCombinedCourseIds({
      combinedCourseIds,
    });

    const modulesIdsToDelete = [];

    for (const combinedCourseId of combinedCourseIds) {
      const { modules } = await combinedCourseDetailsService.instantiateCombinedCourseDetails({
        combinedCourseId: combinedCourseId,
      });
      modulesIdsToDelete.push(...modules.map((module) => module.id));
    }

    await organizationLearnerParticipationRepository.deletePassagesByModuleIds({
      moduleIds: modulesIdsToDelete,
      userId,
    });

    for (const campaignId of campaignIds) {
      const campaign = await campaignRepository.get({
        id: campaignId,
      });
      await campaignRepository.deleteCampaignsInCombinedCourses({
        userId,
        organizationId: campaign.organizationId,
        campaignIds: [campaign.id],
        keepPreviousDeletion: true,
        userRole: PIX_ADMIN.ROLES.SUPER_ADMIN,
        client: CLIENTS.SCRIPT,
      });
    }
  },
);
