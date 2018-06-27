const buildSkillCollection = require('./build-skill-collection');
const SkillReview = require('../../lib/domain/models/SkillReview');

module.exports = function buildSkillReview({
  id = 1234,
  targetedSkills = buildSkillCollection(),
  validatedSkills = [targetedSkills[0]],
  failedSkills = [targetedSkills[1]],
} = {}) {
  return new SkillReview({ id, targetedSkills, validatedSkills, failedSkills });
};
