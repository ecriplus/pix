export async function createLcmsRelease({ LearningContentCache }) {
  await LearningContentCache.instance.update();
}
