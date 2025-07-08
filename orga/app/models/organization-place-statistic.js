import Model, { attr } from '@ember-data/model';

export default class PlaceStatistics extends Model {
  @attr('number') available;
  @attr('number') total;
  @attr('number') occupied;
  @attr('number') anonymousSeat;
  @attr('boolean') hasReachMaximumPlacesWithThreshold;

  get hasAnonymousSeat() {
    return this.anonymousSeat > 0;
  }
}
