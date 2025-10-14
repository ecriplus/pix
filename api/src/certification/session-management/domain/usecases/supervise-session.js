//@ts-check
/**
 * @typedef {import('./index.js').InvigilatorSessionRepository} InvigilatorSessionRepository
 * @typedef {import('./index.js').SupervisorAccessRepository} SupervisorAccessRepository
 * @typedef {import('./index.js').CertificationCenterRepository} CertificationCenterRepository
 * @typedef {import('./index.js').CertificationCenterAccessRepository} CertificationCenterAccessRepository
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
import {
  CertificationCenterIsArchivedError,
  InvalidSessionSupervisingLoginError,
  SessionNotAccessible,
} from '../errors.js';

export const superviseSession = withTransaction(
  /**
   * @param {Object} params
   * @param {number} params.sessionId
   * @param {string} params.invigilatorPassword
   * @param {number} params.userId
   * @param {InvigilatorSessionRepository} params.invigilatorSessionRepository
   * @param {SupervisorAccessRepository} params.supervisorAccessRepository
   * @param {CertificationCenterRepository} params.certificationCenterRepository
   * @param {CertificationCenterAccessRepository} params.certificationCenterAccessRepository
   */
  async ({
    sessionId,
    invigilatorPassword,
    userId,
    invigilatorSessionRepository,
    supervisorAccessRepository,
    certificationCenterRepository,
    certificationCenterAccessRepository,
  }) => {
    const session = await invigilatorSessionRepository.get({ id: sessionId });

    const certificationCenter = await certificationCenterRepository.getBySessionId({ sessionId });

    if (session.isNotAccessible) {
      throw new SessionNotAccessible();
    }

    const certificationCenterAccess = await certificationCenterAccessRepository.getCertificationCenterAccess({
      certificationCenterId: certificationCenter.id,
    });

    if (certificationCenterAccess.isAccessBlockedCollege) {
      throw new SessionNotAccessible(certificationCenterAccess.pixCertifScoBlockedAccessDateCollege);
    }

    if (certificationCenterAccess.isAccessBlockedLycee) {
      throw new SessionNotAccessible(certificationCenterAccess.pixCertifScoBlockedAccessDateLycee);
    }

    if (certificationCenterAccess.isAccessBlockedAEFE) {
      throw new SessionNotAccessible(certificationCenterAccess.pixCertifScoBlockedAccessDateLycee);
    }

    if (certificationCenterAccess.isAccessBlockedAgri) {
      throw new SessionNotAccessible(certificationCenterAccess.pixCertifScoBlockedAccessDateLycee);
    }

    if (!session.checkPassword(invigilatorPassword)) {
      throw new InvalidSessionSupervisingLoginError();
    }

    if (certificationCenter.archivedAt || certificationCenter.archivedBy) {
      throw new CertificationCenterIsArchivedError();
    }

    await supervisorAccessRepository.create({ sessionId, userId });
  },
);
