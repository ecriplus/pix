import { LearningContentRepository } from './learning-content-repository.js';

export const thematicRepository = new LearningContentRepository({ tableName: 'learningcontent.thematics' });
