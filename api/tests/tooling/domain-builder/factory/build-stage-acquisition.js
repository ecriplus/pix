import { StageAcquisition } from '../../../../src/prescription/stages/domain/models/StageAcquisition.js';

const buildStageAcquisition = function ({ id = 1, stageId = 4000, campaignParticipationId = 5000 } = {}) {
  return new StageAcquisition({
    id,
    stageId,
    campaignParticipationId,
  });
};

export { buildStageAcquisition };
