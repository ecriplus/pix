import { hasMany, Model } from 'miragejs';

export default Model.extend({
  certificationChallengesForAdministration: hasMany('certificationChallengesForAdministration'),
});
