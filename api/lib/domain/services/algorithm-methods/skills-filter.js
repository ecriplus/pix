import {
  DEFAULT_LEVEL_FOR_FIRST_CHALLENGE,
  MAX_DIFF_BETWEEN_USER_LEVEL_AND_SKILL_LEVEL,
  MAX_LEVEL_TO_BE_AN_EASY_TUBE,
} from '../../constants.js';

const getPlayableSkills = (skills) => skills.filter(({ isPlayable }) => isPlayable);

const notAlreadyTestedSkill = (knowledgeElements) => (skill) => {
  const alreadyTestedSkillIds = knowledgeElements.map(({ skillId }) => skillId);
  return !alreadyTestedSkillIds.includes(skill.id);
};

const getUntestedSkills = (knowledgeElements, skills) => skills.filter(notAlreadyTestedSkill(knowledgeElements));

const keepSkillsFromEasyTubes = (tubes, targetSkills) => {
  const skillsFromEasyTubes = getPrioritySkills(tubes);
  const availableSkillsFromEasyTubes = targetSkills.filter((targetSkill) =>
    skillsFromEasyTubes.map(({ id }) => id).includes(targetSkill.id),
  );
  return availableSkillsFromEasyTubes.length ? availableSkillsFromEasyTubes : targetSkills;
};

const removeTimedSkillsIfNeeded = (isLastChallengeTimed, targetSkills) => {
  if (isLastChallengeTimed) {
    const skillsWithoutTimedChallenges = targetSkills.filter(({ timed }) => !timed);
    return skillsWithoutTimedChallenges.length > 0 ? skillsWithoutTimedChallenges : targetSkills;
  }
  return targetSkills;
};

const getPrioritySkills = (tubes) => {
  const easyTubes = getEasyTubes(tubes);
  return getSkillsFromTubes(easyTubes);
};

const getEasyTubes = (tubes) =>
  tubes?.filter((tube) => tube.getHardestSkill().difficulty <= MAX_LEVEL_TO_BE_AN_EASY_TUBE);
const getSkillsFromTubes = (tubes) => (tubes ? tubes.flatMap(({ skills }) => skills) : []);

const remapDifficulty = (difficulty) =>
  Number(difficulty) === DEFAULT_LEVEL_FOR_FIRST_CHALLENGE ? Number.MIN_VALUE : Number(difficulty);

const focusOnDefaultLevel = (targetSkills) =>
  targetSkills.reduce((defaultLevelSkills, skill) => {
    if (defaultLevelSkills.length === 0) {
      defaultLevelSkills.push(skill);
      return defaultLevelSkills;
    }

    const currentSkillRemappedDifficulty = remapDifficulty(skill.difficulty);
    const accumulatorFirstSkillRemappedDifficulty = remapDifficulty(defaultLevelSkills[0].difficulty);

    if (currentSkillRemappedDifficulty < accumulatorFirstSkillRemappedDifficulty) {
      defaultLevelSkills = [skill];
    }

    if (currentSkillRemappedDifficulty === accumulatorFirstSkillRemappedDifficulty) {
      defaultLevelSkills.push(skill);
    }

    return defaultLevelSkills;
  }, []);

const isSkillTooHard = (skill, predictedLevel) =>
  skill.difficulty - predictedLevel > MAX_DIFF_BETWEEN_USER_LEVEL_AND_SKILL_LEVEL;

const removeTooDifficultSkills = (predictedLevel, targetSkills) =>
  targetSkills.filter((skill) => !isSkillTooHard(skill, predictedLevel));

const getFilteredSkillsForFirstChallenge = ({ knowledgeElements, tubes, targetSkills }) => {
  const playableSkills = getPlayableSkills(targetSkills);
  const untestedSkills = getUntestedSkills(knowledgeElements, playableSkills);
  const skillsFromEasyTubes = keepSkillsFromEasyTubes(tubes, untestedSkills);
  const skillsWithoutTimedSkills = removeTimedSkillsIfNeeded(true, skillsFromEasyTubes);
  return focusOnDefaultLevel(skillsWithoutTimedSkills);
};

const getFilteredSkillsForNextChallenge = ({
  knowledgeElements,
  tubes,
  predictedLevel,
  isLastChallengeTimed,
  targetSkills,
}) => {
  const playableSkills = getPlayableSkills(targetSkills);
  const untestedSkills = getUntestedSkills(knowledgeElements, playableSkills);
  const skillsFromEasyTubes = keepSkillsFromEasyTubes(tubes, untestedSkills);
  const skillsWithoutTimedSkills = removeTimedSkillsIfNeeded(isLastChallengeTimed, skillsFromEasyTubes);
  return removeTooDifficultSkills(predictedLevel, skillsWithoutTimedSkills);
};

export { focusOnDefaultLevel, getFilteredSkillsForFirstChallenge, getFilteredSkillsForNextChallenge };
