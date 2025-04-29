import { withTransaction } from '../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { ModuleDoesNotExistError } from '../errors.js';

const createPassage = withTransaction(async function ({
  moduleSlug,
  userId,
  moduleRepository,
  passageRepository,
  userRepository,
}) {
  const module = await _getModule({ slug: moduleSlug, moduleRepository });
  if (userId !== null) {
    await userRepository.get(userId);
  }

  const passage = await passageRepository.save({ moduleId: module.id, userId });

  return passage;
});

async function _getModule({ slug, moduleRepository }) {
  try {
    return await moduleRepository.getBySlug({ slug });
  } catch (e) {
    if (e instanceof NotFoundError) {
      throw new ModuleDoesNotExistError();
    }
    throw e;
  }
}

export { createPassage };
