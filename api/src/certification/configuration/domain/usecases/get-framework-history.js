/**
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 * @typedef {import ('./index.js').ConsolidatedFrameworkRepository} ConsolidatedFrameworkRepository
 */

/**
 * @param {Object} params
 * @param {ComplementaryCertificationKeys} params.complementaryCertificationKey
 * @param {ConsolidatedFrameworkRepository} params.consolidatedFrameworkRepository
 */
export const getFrameworkHistory = async ({ complementaryCertificationKey, consolidatedFrameworkRepository }) => {
  const frameworkHistory = await consolidatedFrameworkRepository.getFrameworkHistory({
    complementaryCertificationKey,
  });

  return frameworkHistory;
};
