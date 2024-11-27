export async function createLearningContentRelease({ LearningContentCache }) {
  await LearningContentCache.instance.update();
}
