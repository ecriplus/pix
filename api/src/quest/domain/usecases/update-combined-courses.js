export async function updateCombinedCourses({ combinedCourseIds, name, combinedCourseRepository }) {
  await combinedCourseRepository.updateCombinedCourses({ combinedCourseIds, name });
}
