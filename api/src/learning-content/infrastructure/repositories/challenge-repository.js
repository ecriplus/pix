import { LearningContentRepository } from './learning-content-repository.js';

export const challengeRepository = new LearningContentRepository({
  tableName: 'learningcontent.challenges',
  chunkSize: 500,
});
