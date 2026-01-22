import { withTransaction } from '../../../shared/domain/DomainTransaction.js';

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
    throw new Error();
  }

  await organizationForAdminRepository.archive({ id: organizationId, archivedBy: userId });
  return await organizationForAdminRepository.get({ organizationId });
});

const _arePlacesLotsActive = (organizationPlacesLots) => {
  return Boolean(organizationPlacesLots.find((organizationPlacesLot) => organizationPlacesLot.isActive()));
};

export { archiveOrganization };
