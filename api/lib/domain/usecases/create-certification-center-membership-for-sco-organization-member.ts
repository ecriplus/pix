// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createCertificationCenterMembershipForScoOrganizationMember({
  membership,
  membershipRepository,
  certificationCenterRepository,
  certificationCenterMembershipRepository
}: $TSFixMe) {
  const existingMembership = await membershipRepository.get(membership.id);

  if (membership.isAdmin && existingMembership.organization.isScoAndHasExternalId) {
    const existingCertificationCenter = await certificationCenterRepository.findByExternalId({
      externalId: existingMembership.organization.externalId,
    });

    if (existingCertificationCenter) {
      const isAlreadyMemberOfCertificationCenter =
        await certificationCenterMembershipRepository.isMemberOfCertificationCenter({
          userId: existingMembership.user.id,
          certificationCenterId: existingCertificationCenter.id,
        });

      if (!isAlreadyMemberOfCertificationCenter) {
        return await certificationCenterMembershipRepository.save({
          userId: existingMembership.user.id,
          certificationCenterId: existingCertificationCenter.id,
        });
      }
    }
  }
};
