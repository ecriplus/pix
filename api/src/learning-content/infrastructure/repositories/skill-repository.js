import { LearningContentRepository } from './learning-content-repository.js';

export const skillRepository = new LearningContentRepository({ tableName: 'learningcontent.skills' });
