import { USER_RECOMMENDED_TRAININGS_TABLE_NAME } from '../../migrations/20221017085933_create-user-recommended-trainings.js';
import { databaseBuffer } from '../database-buffer.js';

const buildUserRecommendedTraining = function ({
  id = databaseBuffer.getNextId(),
  userId,
  trainingId,
  campaignParticipationId,
  createdAt = new Date(),
  updatedAt = new Date(),
} = {}) {
  return databaseBuffer.pushInsertable({
    tableName: USER_RECOMMENDED_TRAININGS_TABLE_NAME,
    values: { id, userId, trainingId, campaignParticipationId, createdAt, updatedAt },
  });
};

export { buildUserRecommendedTraining };
