import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const anonymizeUser = withTransaction(
  async ({ userId, campaignParticipationRepositoryFromBC, organizationLearnerRepository }) => {
    const learners = await organizationLearnerRepository.findByUserId({ userId });
    for (const learner of learners) {
      learner.detachUser();
      await organizationLearnerRepository.update(learner);
      const campaignParticipations =
        await campaignParticipationRepositoryFromBC.getAllCampaignParticipationsForOrganizationLearner({
          organizationLearnerId: learner.id,
        });
      for (const campaignParticipation of campaignParticipations) {
        campaignParticipation.detachUser();
        await campaignParticipationRepositoryFromBC.update(campaignParticipation);
      }
    }
  },
);
