/**
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 * @typedef {import ('./index.js').FrameworkChallengesRepository} FrameworkChallengesRepository
 * @typedef {import ('./index.js').LearningContentRepository} LearningContentRepository
 * @typedef {import ('./index.js').VersionsRepository} VersionsRepository
 */

import { NotFoundError } from '../../../../shared/domain/errors.js';

/**
 * @param {Object} params
 * @param {ComplementaryCertificationKeys} params.complementaryCertificationKey
 * @param {FrameworkChallengesRepository} params.frameworkChallengesRepository
 * @param {LearningContentRepository} params.learningContentRepository
 * @param {VersionsRepository} params.versionsRepository
 */
export const getCurrentFrameworkVersion = async ({
  complementaryCertificationKey,
  frameworkChallengesRepository,
  learningContentRepository,
  versionsRepository,
}) => {
  const activeVersion = await versionsRepository.findActiveByScope({ scope: complementaryCertificationKey });

  if (!activeVersion) {
    throw new NotFoundError(`There is no framework for complementary ${complementaryCertificationKey}`);
  }

  const frameworkChallenges = await frameworkChallengesRepository.getByVersionId({
    versionId: activeVersion.id,
  });

  const frameworkAreas = await learningContentRepository.getFrameworkReferential({
    challengeIds: frameworkChallenges.challenges.map(({ challengeId }) => challengeId),
  });

  return {
    scope: activeVersion.scope,
    versionId: activeVersion.id,
    areas: frameworkAreas,
  };
};
