import {
  ParentOrganizationNotInNetworkError,
  UnableToAttachChildOrganizationToParentOrganizationError,
} from '../errors.js';
import { Organization } from '../models/Organization.js';

const createOrganization = async function ({
  organization,
  administrationTeamRepository,
  countryRepository,
  dataProtectionOfficerRepository,
  organizationForAdminRepository,
  organizationLearnerTypeRepository,
  organizationCreationValidator,
  schoolRepository,
  codeGenerator,
  organizationVerificationService,
}) {
  if (organization.parentOrganizationId) {
    const parentOrganization = await organizationForAdminRepository.get({
      organizationId: organization.parentOrganizationId,
    });

    // TODO: Supprimer cette vérification quand on aura implémenté la possibilité d'avoir des organisations avec plusieurs niveaux de hiérarchie (ex: réseau → académie → département → école)
    _assertParentOrganizationIsNotChildOrganization(parentOrganization);

    _assertParentOrganizationBelongsToNetwork(parentOrganization);
  }

  organizationCreationValidator.validate(organization);

  await organizationVerificationService.checkOrganizationLearnerTypeExists(
    organization.organizationLearnerType.id,
    organizationLearnerTypeRepository,
  );

  await organizationVerificationService.checkCountryExists(organization.countryCode, countryRepository);

  await organizationVerificationService.checkAdministrationTeamExists(
    organization.administrationTeamId,
    administrationTeamRepository,
  );

  const savedOrganization = await organizationForAdminRepository.save({
    organization,
  });

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
  return await organizationForAdminRepository.get({
    organizationId: savedOrganization.id,
  });
};

export { createOrganization };

function _assertParentOrganizationBelongsToNetwork(parentOrganization) {
  if (!parentOrganization.network.id) {
    throw new ParentOrganizationNotInNetworkError({ meta: { parentOrganizationId: parentOrganization.id } });
  }
}

function _assertParentOrganizationIsNotChildOrganization(parentOrganization) {
  if (parentOrganization.parentOrganizationId) {
    throw new UnableToAttachChildOrganizationToParentOrganizationError({
      code: 'UNABLE_TO_ATTACH_CHILD_ORGANIZATION_TO_ANOTHER_CHILD_ORGANIZATION',
      message: 'Unable to attach child organization to parent organization which is also a child organization',
      meta: {
        grandParentOrganizationId: parentOrganization.parentOrganizationId,
        parentOrganizationId: parentOrganization.id,
      },
    });
  }
}
