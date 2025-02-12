import { NotFoundError } from '../../../shared/domain/errors.js';

const detachTargetProfilesFromTraining = async function ({
  trainingId,
  targetProfileId,
  targetProfileTrainingRepository,
}) {
  const hasBeenDetached = await targetProfileTrainingRepository.remove({ trainingId, targetProfileId });
  if (!hasBeenDetached) {
    throw new NotFoundError('Target profile training not found');
  }
};

export { detachTargetProfilesFromTraining };
