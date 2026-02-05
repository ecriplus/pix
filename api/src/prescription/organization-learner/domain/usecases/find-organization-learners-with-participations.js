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
  let organizationLearners = [];

  for (const userId of userIds) {
    const learners = await libOrganizationLearnerRepository.findByUserId({ userId });
    organizationLearners = organizationLearners.concat(learners);
  }
  const results = [];
  for (const organizationLearner of organizationLearners) {
    const organization = await organizationRepository.get(organizationLearner.organizationId);
    const campaignParticipationOverviews = await campaignParticipationOverviewRepository.findByOrganizationLearnerId({
      organizationLearnerId: organizationLearner.id,
    });
    const tags = await tagRepository.findByIds(organization.tags.map((tag) => tag.id));

    results.push({
      organizationLearner,
      organization,
      campaignParticipations: campaignParticipationOverviews,
      tagNames: tags.map((tag) => tag.name),
    });
  }
  return results;
});

export { findOrganizationLearnersWithParticipations };
