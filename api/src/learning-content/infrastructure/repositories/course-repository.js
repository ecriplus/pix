import { LearningContentRepository } from './learning-content-repository.js';

export const courseRepository = new LearningContentRepository({ tableName: 'learningcontent.courses' });
