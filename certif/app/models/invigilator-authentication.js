import Model, { attr } from '@ember-data/model';

export default class InvigilatorAuthentication extends Model {
  @attr('string') sessionId;
  @attr('string') invigilatorPassword;
}
