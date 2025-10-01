export async function getCombinedCourseByCode({ userId, code, questRepository, combinedCourseDetailsService }) {
  const quest = await questRepository.getByCode({ code });
  return combinedCourseDetailsService.getCombinedCourseDetails({
    userId,
    questId: quest.id,
  });
}
