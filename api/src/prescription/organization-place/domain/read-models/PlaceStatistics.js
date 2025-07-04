import _ from 'lodash';

import { config } from '../../../../shared/config.js';

export class PlaceStatistics {
  #placesLots;
  #placeRepartition;

  constructor({ placesLots = [], placeRepartition, organizationId } = {}) {
    this.id = `${organizationId}_place_statistics`;
    this.#placesLots = placesLots;
    this.#placeRepartition = placeRepartition;
  }

  static buildFrom({ placesLots, placeRepartition, organizationId } = {}) {
    return new PlaceStatistics({ placesLots, placeRepartition, organizationId });
  }

  get #activePlacesLots() {
    return this.#placesLots.filter((placesLot) => placesLot.isActive);
  }

  get total() {
    if (!this.#placesLots) return 0;
    const activePlaces = this.#activePlacesLots;
    return _.sumBy(activePlaces, 'count');
  }

  get occupied() {
    return this.#placeRepartition.totalRegisteredParticipant + this.#placeRepartition.totalUnRegisteredParticipant;
  }

  get anonymousSeat() {
    return this.#placeRepartition.totalUnRegisteredParticipant;
  }

  get available() {
    const available = this.total - this.occupied;
    if (available < 0) return 0;
    return available;
  }

  get placesLotsTotal() {
    return this.#activePlacesLots.length;
  }

  get hasReachMaximumPlacesWithThreshold() {
    if (this.occupied === 0) return false;

    const thresholdLock = config.features.organizationPlacesManagementThreshold;
    const maximumPlaces = this.total + this.total * thresholdLock;
    return this.occupied >= maximumPlaces;
  }
}
