import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { SessionStartedDeletionError } from '../errors.js';

/**
 * @typedef {import("./index.js").SessionManagementRepository} SessionManagementRepository
 * @typedef {import("./index.js").SessionRepository} SessionRepository
 */

/**
 * @param {object} params
 * @param {SessionRepository} params.sessionRepository
 * @param {SessionManagementRepository} params.sessionManagementRepository
 */
const deleteSession = async ({ sessionId, sessionRepository, sessionManagementRepository }) => {
  if (!(await sessionManagementRepository.hasNoStartedCertification({ id: sessionId }))) {
    throw new SessionStartedDeletionError();
  }

  await DomainTransaction.execute(async () => {
    await sessionRepository.remove({ id: sessionId });
  });
};

export { deleteSession };
