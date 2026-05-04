import { StageCollection } from '../../../../../src/prescription/stages/domain/models/StageCollection.js';

const buildStageCollection = function ({ campaignId, stages } = {}) {
  return new StageCollection({ campaignId, stages });
};

export { buildStageCollection };
