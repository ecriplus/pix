import { PlaceStatistics } from '../read-models/PlaceStatistics.js';

/**
 * @function
 * @name getOrganizationPlacesStatistics
 * @typedef {object} payload
 * @property {number} organizationId
 * @property {organizationPlacesLotRepository} organizationPlacesLotRepository
 * @property {organizationLearnerRepository} organizationLearnerRepository
 * @returns {Promise<Array<PlaceStatistics>>}
 */

/**
 * @typedef {object} organizationPlacesLotRepository
 * @property {function} findAllByOrganizationId
 */

/**
 * @typedef {object} organizationLearnerRepository
 * @property {function} findAllLearnerWithAtLeastOneParticipationByOrganizationId
 */

const getOrganizationPlacesStatistics = async function ({
  organizationId,
  organizationPlacesLotRepository,
  organizationLearnerRepository,
}) {
  if (!organizationId) {
    throw new Error('You must provide at least one organizationId.');
  }

  const placesLots = await organizationPlacesLotRepository.findAllByOrganizationIds({
    organizationIds: [organizationId],
  });

  const placeRepartition =
    await organizationLearnerRepository.findAllLearnerWithAtLeastOneParticipationByOrganizationId(organizationId);

  return PlaceStatistics.buildFrom({
    placesLots,
    placeRepartition,
    organizationId,
  });
};

export { getOrganizationPlacesStatistics };
