import { OrganizationLearnerWithOrganization } from '../read-models/OrganizationLearnerWithOrganization.js';

export const findOrganizationLearnersWithOrganizationByUserId = async function ({
  userId,
  organizationRepository,
  libOrganizationLearnerRepository,
}) {
  const organizationLearners = await libOrganizationLearnerRepository.findByUserId({ userId });

  const results = [];
  for (const organizationLearner of organizationLearners) {
    const organization = await organizationRepository.get(organizationLearner.organizationId);
    results.push(
      new OrganizationLearnerWithOrganization({
        organizationLearner,
        organization,
      }),
    );
  }

  return results;
};
