import { config } from '../../config.js';
import { NotFoundError } from '../../domain/errors.js';
import { Course } from '../../domain/models/Course.js';
import * as oldCourseRepository from './course-repository_old.js';
import { LearningContentRepository } from './learning-content-repository.js';

const TABLE_NAME = 'learningcontent.courses';

export async function get(id) {
  if (!config.featureToggles.useNewLearningContent) return oldCourseRepository.get(id);
  const courseDto = await getInstance().load(id);
  if (!courseDto) {
    throw new NotFoundError();
  }
  return toDomain(courseDto);
}

export async function getCourseName(id) {
  if (!config.featureToggles.useNewLearningContent) return oldCourseRepository.getCourseName(id);
  try {
    const course = await get(id);
    return course.name;
  } catch (err) {
    throw new NotFoundError("Le test demandé n'existe pas");
  }
}

export function clearCache(id) {
  return getInstance().clearCache(id);
}

function toDomain(courseDto) {
  return new Course({
    id: courseDto.id,
    name: courseDto.name,
    description: courseDto.description,
    isActive: courseDto.isActive,
    challenges: courseDto.challenges ? [...courseDto.challenges] : null,
    competences: courseDto.competences ? [...courseDto.competences] : null,
  });
}

/** @type {LearningContentRepository} */
let instance;

function getInstance() {
  if (!instance) {
    instance = new LearningContentRepository({ tableName: TABLE_NAME });
  }
  return instance;
}
