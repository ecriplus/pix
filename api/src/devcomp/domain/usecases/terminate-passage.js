import { NotFoundError } from '../../../shared/domain/errors.js';
import { PassageDoesNotExistError, PassageTerminatedError } from '../errors.js';

const terminatePassage = async function ({ passageId, passageRepository, updateCombinedCourseJobRepository }) {
  const passage = await _getPassage({ passageId, passageRepository });
  if (passage.terminatedAt) {
    throw new PassageTerminatedError();
  }
  passage.terminate();
  const terminatedPassage = await passageRepository.update({ passage });

  if (terminatedPassage.userId) {
    await updateCombinedCourseJobRepository.performAsync({
      userId: terminatedPassage.userId,
      moduleId: terminatedPassage.moduleId,
    });
  }
  return terminatedPassage;
};

async function _getPassage({ passageId, passageRepository }) {
  try {
    return await passageRepository.get({ passageId });
  } catch (e) {
    if (e instanceof NotFoundError) {
      throw new PassageDoesNotExistError();
    }
  }
}

export { terminatePassage };
