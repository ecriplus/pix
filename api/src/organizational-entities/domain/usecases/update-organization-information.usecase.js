const updateOrganizationInformation = async function ({ organization, organizationForAdminRepository, tagRepository }) {
  const existingOrganization = await organizationForAdminRepository.get({ organizationId: organization.id });
  const tagsToUpdate = await tagRepository.findByIds(organization.tagIds);

  existingOrganization.updateWithDataProtectionOfficerAndTags(
    organization,
    organization.dataProtectionOfficer,
    tagsToUpdate,
  );

  await organizationForAdminRepository.update({ organization: existingOrganization });

  return organizationForAdminRepository.get({ organizationId: organization.id });
};

export { updateOrganizationInformation };
