import { withTransaction } from '../../../shared/domain/DomainTransaction.js';
import { ArchiveOrganizationError } from '../errors.js';

const archiveOrganization = withTransaction(async function ({
  organizationId,
  userId,
  organizationForAdminRepository,
  organizationPlacesLotRepository,
}) {
  const organizationPlacesLots = await organizationPlacesLotRepository.findAllByOrganizationIds({
    organizationIds: [organizationId],
  });

  if (_arePlacesLotsActive(organizationPlacesLots)) {
    throw new ArchiveOrganizationError({ message: 'Organization with active lots cannot be archived' });
  }

  await organizationForAdminRepository.archive({ id: organizationId, archivedBy: userId });
  return await organizationForAdminRepository.get({ organizationId });
});

const _arePlacesLotsActive = (organizationPlacesLots) => {
  return Boolean(organizationPlacesLots.find((organizationPlacesLot) => organizationPlacesLot.isActive));
};

export { archiveOrganization };
