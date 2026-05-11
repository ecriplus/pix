import Model, { attr } from '@ember-data/model';

export default class IsCertifiable extends Model {
  @attr('boolean') isCertifiable;
  // eslint-disable-next-line ember/no-empty-attrs
  @attr doubleCertificationEligibility;
}
