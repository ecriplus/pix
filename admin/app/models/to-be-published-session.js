import { service } from '@ember/service';
import Model, { attr } from '@ember-data/model';

export default class ToBePublishedSession extends Model {
  @service intl;

  @attr() certificationCenterName;
  @attr('date-only') sessionDate;
  @attr() sessionTime;
  @attr() finalizedAt;

  get printableDateAndTime() {
    const formattedSessionDate = this.sessionDate.split('-').reverse().join('/');
    return formattedSessionDate + ' à ' + this.sessionTime;
  }

  get printableFinalizationDate() {
    return this.intl.formatDate(this.finalizedAt);
  }
}
