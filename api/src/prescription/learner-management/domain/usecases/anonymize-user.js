import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const anonymizeUser = withTransaction(
  async ({ userId, campaignParticipationRepositoryFromBC, organizationLearnerRepository }) => {
    const learners = await organizationLearnerRepository.findByUserId({ userId });
    const campaignParticipationToAnonymize = [];
    const learnerIds = [];

    for (const learner of learners) {
      learner.detachUser();
      learnerIds.push(learner.id);
      await organizationLearnerRepository.update(learner);
    }

    const campaignParticipations =
      await campaignParticipationRepositoryFromBC.getAllCampaignParticipationsForOrganizationLearnerIds({
        organizationLearnerIds: learnerIds,
      });

    for (const campaignParticipation of campaignParticipations) {
      campaignParticipation.detachUser();
      campaignParticipationToAnonymize.push(campaignParticipation.dataToUpdateOnAnonymisation);
    }

    await campaignParticipationRepositoryFromBC.updateInBatchByIds(campaignParticipationToAnonymize);
  },
);
