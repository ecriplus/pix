import { lcmsClient } from '../../../../src/shared/infrastructure/lcms-client.js';
import { logger, SCOPES } from '../../../../src/shared/infrastructure/utils/logger.js';

export async function learningContentBuilder({ databaseBuilder }) {
  const learningContent = await lcmsClient.getLatestRelease();

  const totalSkillsCount = learningContent.skills.length;
  const totalChallengesCount = learningContent.challenges.length;
  const totalTutorialsCount = learningContent.tutorials.length;

  learningContent.skills = learningContent.skills.filter(isActiveOrArchived);

  learningContent.challenges = learningContent.challenges
    .filter(belongsToOneOf(learningContent.skills))
    .filter(isValidatedOrArchived)
    .filter(keepingPrototypeAndOneAlternativeBySkillAndLocale());

  learningContent.tutorials = learningContent.tutorials.filter(isUsedByOneOf(learningContent.skills));

  logger.debug(
    { event: SCOPES.LEARNING_CONTENT },
    `inserting ${learningContent.skills.length} skills out of ${totalSkillsCount}`,
  );
  logger.debug(
    { event: SCOPES.LEARNING_CONTENT },
    `inserting ${learningContent.challenges.length} challenges out of ${totalChallengesCount}`,
  );
  logger.debug(
    { event: SCOPES.LEARNING_CONTENT },
    `inserting ${learningContent.tutorials.length} tutorials out of ${totalTutorialsCount}`,
  );

  databaseBuilder.factory.learningContent.build(learningContent);
  await databaseBuilder.commit();
}

function isActiveOrArchived(skill) {
  return ['actif', 'archivé'].includes(skill.status);
}

function belongsToOneOf(skills) {
  const skillIds = new Set(skills.map((skill) => skill.id));
  return (challenge) => skillIds.has(challenge.skillId);
}

function isValidatedOrArchived(challenge) {
  return ['validé', 'archivé'].includes(challenge.status);
}

function keepingPrototypeAndOneAlternativeBySkillAndLocale() {
  const alternativesCountBySkillAndLocale = new Map();

  return (challenge) => {
    if (challenge.genealogy === 'Prototype 1') return true;

    const alternativeKey = `${challenge.skillId}:${challenge.locales[0]}`;
    if (alternativesCountBySkillAndLocale.get(alternativeKey) ?? 0 >= 1) {
      return false;
    }
    alternativesCountBySkillAndLocale.set(alternativeKey, alternativesCountBySkillAndLocale.get(alternativeKey) + 1);
    return true;
  };
}

function isUsedByOneOf(skills) {
  const tutorialIds = new Set(skills.flatMap((skill) => [...skill.tutorialIds, skill.learningMoreTutorialIds]));
  return (tutorial) => tutorialIds.has(tutorial.id);
}
