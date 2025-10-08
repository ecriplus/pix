import { AdministrationTeamNotFound } from '../errors.js';
import { Organization } from '../models/Organization.js';

const createOrganization = async function ({
  organization,
  administrationTeamRepository,
  dataProtectionOfficerRepository,
  organizationForAdminRepository,
  organizationCreationValidator,
  schoolRepository,
  codeGenerator,
}) {
  organizationCreationValidator.validate(organization);

  const administrationTeam = await administrationTeamRepository.getById(organization.administrationTeamId);

  if (!administrationTeam) {
    throw new AdministrationTeamNotFound({
      meta: {
        administrationTeamId: organization.administrationTeamId,
      },
    });
  }

  const savedOrganization = await organizationForAdminRepository.save({ organization });

  await dataProtectionOfficerRepository.create({
    organizationId: savedOrganization.id,
    firstName: organization.dataProtectionOfficer.firstName,
    lastName: organization.dataProtectionOfficer.lastName,
    email: organization.dataProtectionOfficer.email,
  });

  if (savedOrganization.type === Organization.types.SCO1D) {
    const code = await codeGenerator.generate(schoolRepository);
    await schoolRepository.save({ organizationId: savedOrganization.id, code });
  }
  return await organizationForAdminRepository.get({ organizationId: savedOrganization.id });
};

export { createOrganization };
