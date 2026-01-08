import { NotFoundError } from '../../../shared/domain/errors.js';

export const getCombinedCourseBlueprintById = async ({ id, combinedCourseBlueprintRepository }) => {
  const result = await combinedCourseBlueprintRepository.findById({ id });
  if (!result) {
    throw new NotFoundError('Combined course blueprint not found');
  }
  return result;
};
