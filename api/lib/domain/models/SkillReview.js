const SKILL_REVIEW_ID_PREFIX = 'skill-review-';

/*
 * Traduction : Profil d'avancement
 */
class SkillReview {

  constructor({ id, targetedSkills, validatedSkills, failedSkills } = {}) {
    this.id = id;
    this.targetedSkills = targetedSkills;
    this.validatedSkills = validatedSkills;
    this.failedSkills = failedSkills;
  }

  get profileMasteryRate() {
    const numberOfTargetedSkills = this.targetedSkills.length;
    const numberOfValidatedSkills = this.validatedSkills.length;
    const targetProfileHasSkills = numberOfTargetedSkills !== 0;

    return targetProfileHasSkills ? (numberOfValidatedSkills / numberOfTargetedSkills) : 0;
  }

  static generateIdFromAssessmentId(assessmentId) {
    return `${SKILL_REVIEW_ID_PREFIX}${assessmentId}`;
  }

  static getAssessmentIdFromId(skillReviewId) {
    return parseInt(skillReviewId.replace(SKILL_REVIEW_ID_PREFIX, ''), 10);
  }
}

module.exports = SkillReview;
