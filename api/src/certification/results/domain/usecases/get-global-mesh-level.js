/**
 * @typedef {import ('./index.js').ScoringConfigurationRepository} ScoringConfigurationRepository
 * @typedef {import ('./index.js').PixScoreToMeshLevelService} PixScoreToMeshLevelService
 */

/**
 * @param {Object} params
 * @param {number} params.pixScore
 * @param {Date} params.certificationDate - the mesh levels depends on the configuration at date
 * @param {Object} params.i18n
 * @param {ScoringConfigurationRepository} params.scoringConfigurationRepository
 * @param {PixScoreToMeshLevelService} params.pixScoreToMeshLevelService
 */
export const getGlobalMeshLevel = async ({
  pixScore,
  certificationDate,
  i18n,
  scoringConfigurationRepository,
  pixScoreToMeshLevelService,
}) => {
  const scoringConfiguration = await scoringConfigurationRepository.getLatestByDateAndLocale({
    date: certificationDate,
    locale: i18n.getLocale(),
  });

  return pixScoreToMeshLevelService.getMeshLevel({ pixScore, scoringConfiguration });
};
