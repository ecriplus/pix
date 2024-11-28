import { LearningContentRepository } from './learning-content-repository.js';

export const competenceRepository = new LearningContentRepository({ tableName: 'learningcontent.competences' });
