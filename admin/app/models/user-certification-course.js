import Model, { attr } from '@ember-data/model';

export default class UserCertificationCourse extends Model {
  @attr('date') createdAt;
  @attr('boolean') isPublished;
  @attr() sessionId;
}
