/** @param {import('./dependencies.js').Dependencies} */
export async function patchLearningContentCacheEntry({
  recordId,
  updatedRecord,
  modelName,
  LearningContentCache,
  frameworkRepository,
  areaRepository,
  competenceRepository,
  thematicRepository,
  tubeRepository,
  skillRepository,
  challengeRepository,
  courseRepository,
  tutorialRepository,
  missionRepository,
}) {
  const currentLearningContent = await LearningContentCache.instance.get();
  const patch = generatePatch(currentLearningContent, recordId, updatedRecord, modelName);
  await LearningContentCache.instance.patch(patch);

  const repository = {
    frameworks: frameworkRepository,
    areas: areaRepository,
    competences: competenceRepository,
    thematics: thematicRepository,
    tubes: tubeRepository,
    skills: skillRepository,
    challenges: challengeRepository,
    courses: courseRepository,
    tutorials: tutorialRepository,
    missions: missionRepository,
  }[modelName];

  await repository.save(updatedRecord);
  repository.clearCache(recordId);
}

function generatePatch(currentLearningContent, id, newEntry, modelName) {
  const index = currentLearningContent[modelName].findIndex((element) => element?.id === id);
  if (index === -1) {
    return {
      operation: 'push',
      path: modelName,
      value: newEntry,
    };
  }
  return {
    operation: 'assign',
    path: `${modelName}[${index}]`,
    value: newEntry,
  };
}
