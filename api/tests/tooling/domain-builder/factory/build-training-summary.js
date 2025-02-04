import { TrainingSummary } from '../../../../src/devcomp/domain/read-models/TrainingSummary.js';

const buildTrainingSummary = function ({
  id = 1,
  title = 'Training Summary 1',
  internalTitle = 'Training Summary 1 internal title',
  prerequisiteThreshold,
  goalThreshold,
  targetProfilesCount = 0,
  isDisabled = false,
} = {}) {
  return new TrainingSummary({
    id,
    title,
    internalTitle,
    prerequisiteThreshold,
    goalThreshold,
    targetProfilesCount,
    isDisabled,
  });
};

export { buildTrainingSummary };
