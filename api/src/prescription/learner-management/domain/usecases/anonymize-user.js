import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const anonymizeUser = withTransaction(
  async ({ userId, campaignParticipationRepositoryfromBC, organizationLearnerRepository }) => {
    const learners = await organizationLearnerRepository.findByUserId({ userId });
    for (const learner of learners) {
      learner.detachUser();
      await organizationLearnerRepository.update(learner);
      const campaignParticipations =
        await campaignParticipationRepositoryfromBC.getAllCampaignParticipationsForOrganizationLearner({
          organizationLearnerId: learner.id,
        });
      for (const campaignParticipation of campaignParticipations) {
        campaignParticipation.detachUser();
        await campaignParticipationRepositoryfromBC.update(campaignParticipation);
      }
    }
  },
);
