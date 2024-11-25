export async function refreshLearningContentCache({ LearningContentCache }) {
  await LearningContentCache.instance.reset();
}
