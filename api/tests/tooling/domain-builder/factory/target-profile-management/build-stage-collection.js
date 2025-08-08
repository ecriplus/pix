import { StageCollection } from '../../../../../src/prescription/target-profile/domain/models/StageCollection.js';

const buildStageCollection = function ({ id, stages = [], maxLevel } = {}) {
  return new StageCollection({ id, stages, maxLevel });
};

export { buildStageCollection };
