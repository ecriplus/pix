import { NotFoundError } from '../../../shared/domain/errors.js';
import { ModuleDoesNotExistError } from '../errors.js';

const createPassage = async function ({ moduleId, userId, moduleRepository, passageRepository, userRepository }) {
  await _getModule({ moduleId, moduleRepository });
  if (userId !== null) {
    await userRepository.get(userId);
  }
  return passageRepository.save({ moduleId, userId });
};

async function _getModule({ moduleId, moduleRepository }) {
  try {
    return await moduleRepository.getBySlug({ slug: moduleId });
  } catch (e) {
    if (e instanceof NotFoundError) {
      throw new ModuleDoesNotExistError();
    }
    throw e;
  }
}

export { createPassage };
