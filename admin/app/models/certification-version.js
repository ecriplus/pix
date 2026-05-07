import Model, { attr, hasMany } from '@ember-data/model';

export default class CertificationVersion extends Model {
  @attr('date') startDate;
  @attr('date') expirationDate;
  @attr('number') assessmentDuration;
  @attr('number') minimumAnswers;
  @attr('number') maximumAssessmentLength;
  @attr('string') comment;

  @hasMany('area', { async: false, inverse: null }) areas;
}
