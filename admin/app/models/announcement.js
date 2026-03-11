import Model, { attr } from '@ember-data/model';

export default class AnnouncementModel extends Model {
  @attr() content;
}
