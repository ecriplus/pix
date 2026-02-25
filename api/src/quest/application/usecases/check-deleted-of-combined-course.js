import * as combinedCourseRepository from '../../infrastructure/repositories/combined-course-repository.js';

const execute = async function ({ code, id, dependencies = { combinedCourseRepository } }) {
  const { deletedAt } = id
    ? await dependencies.combinedCourseRepository.getById({ id })
    : await dependencies.combinedCourseRepository.getByCode({ code });

  return !deletedAt;
};

export { execute };
