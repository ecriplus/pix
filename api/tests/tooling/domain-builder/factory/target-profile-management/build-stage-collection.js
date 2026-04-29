import { TargetProfileStageCollection } from '../../../../../src/prescription/stages/domain/models/TargetProfileStageCollection.js';

const buildStageCollection = function ({ id, stages = [], maxLevel } = {}) {
  return new TargetProfileStageCollection({ id, stages, maxLevel });
};

export { buildStageCollection };
