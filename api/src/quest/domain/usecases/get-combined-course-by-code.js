import { CombinedCourse } from '../models/CombinedCourse.js';

export async function getCombinedCourseByCode({ code, questRepository }) {
  const quest = await questRepository.getByCode({ code });

  return new CombinedCourse(quest);
}
