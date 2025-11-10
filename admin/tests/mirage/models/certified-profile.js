import { hasMany, Model } from 'miragejs';

export default Model.extend({
  certifiedSkills: hasMany('certifiedSkill'),
  certifiedTubes: hasMany('certifiedTube'),
  certifiedCompetences: hasMany('certifiedCompetence'),
  certifiedAreas: hasMany('certifiedArea'),
});
