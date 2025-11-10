import { belongsTo, hasMany, Model } from 'miragejs';

export default Model.extend({
  complementaryCertificationCourseResultWithExternal: belongsTo('complementaryCertificationCourseResultWithExternal'),
  commonComplementaryCertificationCourseResult: belongsTo('commonComplementaryCertificationCourseResult'),
  certificationIssueReports: hasMany('certificationIssueReport'),
});
