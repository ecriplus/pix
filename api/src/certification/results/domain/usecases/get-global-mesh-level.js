/**
 * @typedef {import ('./index.js').PixScoreToMeshLevelService} PixScoreToMeshLevelService
 */

/**
 * @param {Object} params
 * @param {number} params.pixScore
 * @param {PixScoreToMeshLevelService} params.pixScoreToMeshLevelService
 */
export const getGlobalMeshLevel = async ({ pixScore, pixScoreToMeshLevelService }) => {
  return pixScoreToMeshLevelService.getMeshLevel({ pixScore });
};
