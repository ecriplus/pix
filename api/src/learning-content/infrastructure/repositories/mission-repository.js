import { LearningContentRepository } from './learning-content-repository.js';

export const missionRepository = new LearningContentRepository({ tableName: 'learningcontent.missions' });
