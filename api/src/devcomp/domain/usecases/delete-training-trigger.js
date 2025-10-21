import { withTransaction } from '../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../shared/domain/errors.js';

const deleteTrainingTrigger = withTransaction(async function ({
  trainingId,
  trainingTriggerId,
  trainingTriggerRepository,
}) {
  const trainingTriggers = await trainingTriggerRepository.findByTrainingId({
    trainingId,
  });

  const isTrainingTriggerRelatedToTraining = trainingTriggers.some(
    (trainingTrigger) => trainingTrigger.id === trainingTriggerId,
  );

  if (!isTrainingTriggerRelatedToTraining) {
    throw new NotFoundError(`The training trigger ${trainingTriggerId} is not related to the training ${trainingId}`);
  }

  return trainingTriggerRepository.deleteTrainingTrigger({
    trainingTriggerId,
  });
});

export { deleteTrainingTrigger };
