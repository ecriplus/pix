/**
 * @typedef {import('./index.js').SessionRepository} SessionRepository
 *
 * @typedef {import('./index.js').SessionValidator} SessionValidator
 */

import { AlreadyExistingEntityError } from '../../../../shared/domain/errors.js';

/**
 * @param {object} params
 * @param {SessionRepository} params.sessionRepository
 * @param {SessionValidator} params.sessionValidator
 */
const updateSession = async function ({ session, sessionRepository, sessionValidator }) {
  sessionValidator.validate(session);

  const sessionAlreadyExists = await sessionRepository.isSessionExistingByCertificationCenterId({
    address: session.address,
    room: session.room,
    date: session.date,
    time: session.time,
    certificationCenterId: session.certificationCenterId,
    excludeSessionId: session.id,
  });
  if (sessionAlreadyExists) {
    throw new AlreadyExistingEntityError('Une session avec les mêmes informations existe déjà.');
  }

  const sessionToUpdate = await sessionRepository.get({ id: session.id });
  sessionToUpdate.updateInfo(session);
  await sessionRepository.update(sessionToUpdate);
  return sessionRepository.get({ id: sessionToUpdate.id });
};

export { updateSession };
