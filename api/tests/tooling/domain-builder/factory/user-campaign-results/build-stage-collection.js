import { StageCollection } from '../../../../../src/prescription/campaign-participation/domain/models/StageCollection.js';

const buildStageCollection = function ({ campaignId, stages } = {}) {
  return new StageCollection({ campaignId, stages });
};

export { buildStageCollection };
