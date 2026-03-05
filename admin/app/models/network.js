import Model, { attr } from '@ember-data/model';

export default class Network extends Model {
  @attr('string') name;
  @attr('number') organizationId;
}
