export const findOrganizationLearnersByUserId = async ({ userId, organizationLearnerRepository }) => {
  return organizationLearnerRepository.findByUserId({ userId });
};
