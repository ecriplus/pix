import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { PassageDoesNotExistError, PassageTerminatedError } from '../errors.js';

const terminatePassage = async function ({ passageId, passageRepository, updateCombinedCourseJobRepository }) {
  const passage = await DomainTransaction.execute(async () => {
    const passage = await _getPassage({ passageId, passageRepository });
    if (passage.terminatedAt) {
      throw new PassageTerminatedError();
    }
    passage.terminate();
    return passageRepository.update({ passage });
  });
  if (passage.userId) {
    await updateCombinedCourseJobRepository.performAsync({
      userId: passage.userId,
      moduleId: passage.moduleId,
    });
  }
  return passage;
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
