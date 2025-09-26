import Model, { attr, hasMany } from '@ember-data/model';
import { CombinedCourseItemTypes } from 'mon-pix/models/combined-course-item';

export const CombinedCourseStatuses = {
  NOT_STARTED: 'NOT_STARTED',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
};

export default class CombinedCourse extends Model {
  @attr('string') name;
  @attr('string') code;
  @attr() organizationId;
  @attr('string') status;
  @attr('string') description;
  @attr('string') illustration;

  @hasMany('combined-course-item', { async: false, inverse: 'combinedCourse' }) items;

  get nextCombinedCourseItem() {
    return this.hasMany('items')
      .value()
      .find((item) => !item.isCompleted);
  }

  get hasItemOfTypeModule() {
    return Boolean(
      this.hasMany('items')
        ?.value()
        ?.find((item) => item.type === CombinedCourseItemTypes.MODULE),
    );
  }
}
