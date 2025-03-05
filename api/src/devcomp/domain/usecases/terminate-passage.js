import { withTransaction } from '../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { PassageDoesNotExistError, PassageTerminatedError } from '../errors.js';
import { PassageTerminatedEvent } from '../models/passage-events/passage-events.js';

const terminatePassage = withTransaction(async function ({
  passageId,
  requestTimestamp,
  passageRepository,
  passageEventRepository,
}) {
  const passage = await _getPassage({ passageId, passageRepository });
  if (passage.terminatedAt) {
    throw new PassageTerminatedError();
  }
  passage.terminate();
  const terminatedPassage = await passageRepository.update({ passage });
  const event = new PassageTerminatedEvent({
    passageId: terminatedPassage.id,
    occurredAt: new Date(requestTimestamp),
  });
  await passageEventRepository.record(event);
  return terminatedPassage;
});

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
