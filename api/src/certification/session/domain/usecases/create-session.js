/**
 * @typedef {import ('../../../shared/domain/usecases/index.js').CertificationCenterRepository} CertificationCenterRepository
 * @typedef {import ('../../../shared/domain/usecases/index.js').SessionRepository} SessionRepository
 * @typedef {import ('../../../shared/domain/usecases/index.js').SessionValidator} SessionValidator
 * @typedef {import ('../../../shared/domain/usecases/index.js').SessionCodeService} SessionCodeService
 */

import { CertificationVersion } from '../../../shared/domain/models/CertificationVersion.js';
import { Session } from '../models/Session.js';

/**
 * @param {Object} params
 * @param {CertificationCenterRepository} params.certificationCenterRepository
 * @param {SessionRepository} params.sessionRepository
 * @param {SessionValidator} params.sessionValidator
 * @param {SessionCodeService} params.sessionCodeService
 */
const createSession = async function ({
  userId,
  session,
  certificationCenterRepository,
  sessionRepository,
  sessionValidator,
  sessionCodeService,
}) {
  sessionValidator.validate(session);

  const certificationCenterId = session.certificationCenterId;

  const accessCode = sessionCodeService.getNewSessionCode();
  const { isV3Pilot, name: certificationCenterName } = await certificationCenterRepository.get({
    id: certificationCenterId,
  });
  const version = isV3Pilot ? CertificationVersion.V3 : CertificationVersion.V2;

  const domainSession = new Session({
    ...session,
    accessCode,
    certificationCenter: certificationCenterName,
    version,
    createdBy: userId,
  });

  return sessionRepository.save({ session: domainSession });
};

export { createSession };
