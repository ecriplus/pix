import Model, { attr, hasMany } from '@ember-data/model';

export default class CertificationVersion extends Model {
  @attr('date') startDate;
  @attr('date') expirationDate;
  @attr('number') assessmentDuration;
  @attr('number') minimumAnswersRequiredToValidateACertification;
  @attr('number') maximumAssessmentLength;

  @hasMany('area', { async: false, inverse: null }) areas;
}
