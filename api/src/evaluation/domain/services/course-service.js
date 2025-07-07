import { NotFoundError } from '../../../shared/domain/errors.js';
import * as courseRepository from '../../../shared/infrastructure/repositories/course-repository.js';

const getCourse = async function ({ courseId, dependencies = { courseRepository } }) {
  const course = await dependencies.courseRepository.get(courseId);
  if (!course.canBePlayed) {
    throw new NotFoundError("Le test demandé n'existe pas");
  }
  return course;
};

export { getCourse };
