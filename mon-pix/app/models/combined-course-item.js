import Model, { attr, belongsTo } from '@ember-data/model';

export const CombinedCourseItemTypes = {
  CAMPAIGN: 'CAMPAIGN',
  FORMATION: 'FORMATION',
  MODULE: 'MODULE',
};
export default class CombinedCourseItem extends Model {
  @attr('string') reference;
  @attr('string') title;
  @attr('string') type;
  @attr('string') redirection;
  @attr('boolean') isCompleted;
  @attr('boolean') isLocked;
  @attr('number') duration;
  @attr('string') image;

  get route() {
    return this.type === CombinedCourseItemTypes.CAMPAIGN ? 'campaigns' : 'module';
  }

  get iconUrl() {
    if (this.type === CombinedCourseItemTypes.CAMPAIGN)
      return 'https://assets.pix.org/combined-courses/campaign-icon.svg';
    if (this.type === CombinedCourseItemTypes.FORMATION)
      return 'https://assets.pix.org/combined-courses/picto_formation_vector.svg';

    return this.image;
  }

  @belongsTo('combined-course', { async: false, inverse: 'items' }) combinedCourse;
}
