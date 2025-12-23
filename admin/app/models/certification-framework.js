import Model, { attr } from '@ember-data/model';

export default class CertificationFramework extends Model {
  @attr('string') name;
  @attr('date') activeVersionStartDate;
}
