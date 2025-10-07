import { withTransaction } from '../../../shared/domain/DomainTransaction.js';

const deleteTrainingTrigger = withTransaction(async function ({ trainingTriggerId, trainingTriggerRepository }) {
  return trainingTriggerRepository.deleteTrainingTrigger({
    trainingTriggerId,
  });
});

export { deleteTrainingTrigger };
