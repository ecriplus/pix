import Model, { attr } from '@ember-data/model';

export default class CombinedCourseParticipation extends Model {
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') status;
  @attr('number') nbCampaigns;
  @attr('number') nbModules;
  @attr('number') nbCampaignsCompleted;
  @attr('number') nbModulesCompleted;
}

export const COMBINED_COURSE_PARTICIPATION_STATUSES = {
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
};
