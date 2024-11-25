export async function patchLearningContentCacheEntry({ recordId, updatedRecord, modelName, LearningContentCache }) {
  const currentLearningContent = await LearningContentCache.instance.get();
  const patch = generatePatch(currentLearningContent, recordId, updatedRecord, modelName);
  await LearningContentCache.instance.patch(patch);
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
