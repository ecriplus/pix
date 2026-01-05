/**
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 * @typedef {import ('./index.js').FrameworkChallengesRepository} FrameworkChallengesRepository
 * @typedef {import ('./index.js').LearningContentRepository} LearningContentRepository
 * @typedef {import ('./index.js').VersionsRepository} VersionsRepository
 */

import { NotFoundError } from '../../../../shared/domain/errors.js';

/**
 * @param {object} params
 * @param {Scope} params.scope
 * @param {FrameworkChallengesRepository} params.frameworkChallengesRepository
 * @param {LearningContentRepository} params.learningContentRepository
 * @param {VersionsRepository} params.versionsRepository
 */
export const getCurrentFrameworkVersion = async ({
  scope,
  frameworkChallengesRepository,
  learningContentRepository,
  versionsRepository,
}) => {
  const activeVersion = await versionsRepository.findActiveByScope({ scope });

  if (!activeVersion) {
    throw new NotFoundError(`There is no framework for complementary ${scope}`);
  }

  const challenges = await frameworkChallengesRepository.getByVersionId({
    versionId: activeVersion.id,
  });

  const frameworkAreas = await learningContentRepository.getFrameworkReferential({
    challengeIds: challenges.map(({ challengeId }) => challengeId),
  });

  return {
    scope: activeVersion.scope,
    versionId: activeVersion.id,
    areas: frameworkAreas,
  };
};
