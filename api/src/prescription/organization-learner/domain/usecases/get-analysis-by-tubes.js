const getAnalysisByTubes = async function ({ organizationId, analysisRepository }) {
  return analysisRepository.findByTubes({ organizationId });
};

export { getAnalysisByTubes };
