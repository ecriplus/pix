/**
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 * @typedef {import ('./index.js').ConsolidatedFrameworkRepository} ConsolidatedFrameworkRepository
 * @typedef {import ('./index.js').LearningContentRepository} LearningContentRepository
 */

/**
 * @param {Object} params
 * @param {ComplementaryCertificationKeys} params.complementaryCertificationKey
 * @param {ConsolidatedFrameworkRepository} params.consolidatedFrameworkRepository
 * @param {LearningContentRepository} params.learningContentRepository
 */
export const getCurrentConsolidatedFramework = async ({
  complementaryCertificationKey,
  consolidatedFrameworkRepository,
  learningContentRepository,
}) => {
  const currentConsolidatedFramework =
    await consolidatedFrameworkRepository.getCurrentFrameworkByComplementaryCertificationKey({
      complementaryCertificationKey,
    });

  const frameworkAreas = await learningContentRepository.getFrameworkReferential({
    challengeIds: currentConsolidatedFramework.challenges.map(({ challengeId }) => challengeId),
  });

  return { ...currentConsolidatedFramework, areas: frameworkAreas };
};
