export async function refreshLearningContentCache({ lcms, LearningContentCache }) {
  const learningContent = await lcms.getLatestRelease();
  await LearningContentCache.instance.set(learningContent);
}
