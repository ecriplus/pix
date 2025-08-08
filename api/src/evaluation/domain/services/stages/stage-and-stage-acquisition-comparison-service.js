import { StageAcquisitionCollection } from '../../../../prescription/campaign-participation/domain/models/StageAcquisitionCollection.js';

/**
 * Compare stages and stages acquisitions to
 * build stages information for a campaign.
 *
 * @param {Stage[]} availableStages
 * @param {StageAcquisition[]} stageAcquisitions
 * @returns {{reachedStage: Stage, reachedStageNumber: number, totalNumberOfStages: number}}
 */
export const compare = (availableStages, stageAcquisitions) => {
  const stageComparison = new StageAcquisitionCollection(availableStages, stageAcquisitions);

  return {
    reachedStageNumber: stageComparison.reachedStageNumber,
    totalNumberOfStages: stageComparison.totalNumberOfStages,
    reachedStage: stageComparison.reachedStage,
  };
};
