import { LearningContentRepository } from './learning-content-repository.js';

export const tutorialRepository = new LearningContentRepository({ tableName: 'learningcontent.tutorials' });
