import { LearningContentRepository } from './learning-content-repository.js';

export const tubeRepository = new LearningContentRepository({ tableName: 'learningcontent.tubes' });
