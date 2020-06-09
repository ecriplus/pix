module.exports = async function updateOrganizationInformation({
  id,
  name,
  type,
  logoUrl,
  externalId,
  provinceCode,
  isManagingStudents,
  organizationRepository
}) {
  const organization = await organizationRepository.get(id);

  if (name) organization.name = name;
  if (type) organization.type = type;
  if (logoUrl) organization.logoUrl = logoUrl;
  organization.externalId = externalId;
  organization.provinceCode = provinceCode;
  if (isManagingStudents) organization.isManagingStudents = isManagingStudents;

  await organizationRepository.update(organization);

  return organization;
};
