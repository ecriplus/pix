import Model, { attr } from '@ember-data/model';

export default class Announcement extends Model {
  @attr() content;
}
