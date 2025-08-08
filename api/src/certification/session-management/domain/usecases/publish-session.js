import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';

/**
 * @typedef {import ('../../../../../src/certification/session-management/domain/usecases/index.js').CertificationRepository} CertificationRepository
 */

/**
 * @param {Object} params
 * @param {CertificationRepository} params.certificationRepository
 * @param {certificationCenterRepository} params.certificationCenterRepository
 * @param {FinalizedSessionRepository} params.finalizedSessionRepository
 * @param {SessionRepository} params.sessionRepository
 * @param {SharedSessionRepository} params.sharedSessionRepository
 * @param {SessionPublicationService} params.sessionPublicationService
 */
const publishSession = async function ({
  i18n,
  sessionId,
  publishedAt = new Date(),
  certificationRepository,
  certificationCenterRepository,
  finalizedSessionRepository,
  sharedSessionRepository,
  sessionRepository,
  sessionPublicationService,
}) {
  return DomainTransaction.execute(async function () {
    const session = await sessionPublicationService.publishSession({
      sessionId,
      publishedAt,
      certificationRepository,
      finalizedSessionRepository,
      sessionRepository,
      sharedSessionRepository,
    });

    await sessionPublicationService.manageEmails({
      i18n,
      session,
      publishedAt,
      certificationCenterRepository,
      sessionRepository,
    });

    return sessionRepository.get({ id: sessionId });
  });
};

export { publishSession };
