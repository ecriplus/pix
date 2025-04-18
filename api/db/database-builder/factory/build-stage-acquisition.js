import { STAGE_ACQUISITIONS_TABLE_NAME } from '../../migrations/20230721114848_create-stage_acquisitions-table.js';
import { databaseBuffer } from '../database-buffer.js';
import { buildCampaignParticipation } from './build-campaign-participation.js';
import { buildStage } from './build-stage.js';

const buildStageAcquisition = function ({
  id = databaseBuffer.getNextId(),
  stageId = buildStage().id,
  campaignParticipationId = buildCampaignParticipation().id,
  createdAt = new Date('2000-01-01'),
} = {}) {
  return databaseBuffer.pushInsertable({
    tableName: STAGE_ACQUISITIONS_TABLE_NAME,
    values: {
      id,
      stageId,
      campaignParticipationId,
      createdAt,
    },
  });
};

export { buildStageAcquisition };
