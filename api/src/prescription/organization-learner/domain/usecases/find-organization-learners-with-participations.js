import Joi from 'joi';

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

const userIdsSchema = Joi.array().items(Joi.number());

const findOrganizationLearnersWithParticipations = withTransaction(async function ({
  userIds,
  campaignParticipationOverviewRepository,
  organizationRepository,
  libOrganizationLearnerRepository,
  tagRepository,
}) {
  const validationResult = userIdsSchema.validate(userIds);

  if (validationResult.error) {
    return [];
  }

  const organizationLearners = (
    await Promise.all(
      userIds.map((userId) => {
        return libOrganizationLearnerRepository.findByUserId({ userId });
      }),
    )
  ).flat();

  return Promise.all(
    organizationLearners.map(async (organizationLearner) => {
      const organization = await organizationRepository.get(organizationLearner.organizationId);
      const campaignParticipationOverviews = await _getCampaignParticipationOverviewsWithoutPagination({
        userId: organizationLearner.userId,
        campaignParticipationOverviewRepository,
      });
      const tags = await tagRepository.findByIds(organization.tags.map((tag) => tag.id));

      return {
        organizationLearner,
        organization,
        campaignParticipations: campaignParticipationOverviews,
        tagNames: tags.map((tag) => tag.name),
      };
    }),
  );
});

async function _getCampaignParticipationOverviewsWithoutPagination({
  userId,
  campaignParticipationOverviewRepository,
}) {
  const allCampaignParticipationOverviews = [];
  let call = 1;
  let totalPages;

  do {
    const { campaignParticipationOverviews, pagination } =
      await campaignParticipationOverviewRepository.findByUserIdWithFilters({
        userId,
        page: { number: call, size: 100 },
      });
    totalPages = pagination.pageCount;
    allCampaignParticipationOverviews.push(...campaignParticipationOverviews);
    call++;
  } while (call <= totalPages);

  return allCampaignParticipationOverviews;
}

export { _getCampaignParticipationOverviewsWithoutPagination, findOrganizationLearnersWithParticipations };
