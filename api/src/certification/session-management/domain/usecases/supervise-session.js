import {
  CertificationCenterIsArchivedError,
  InvalidSessionSupervisingLoginError,
  SessionNotAccessible,
} from '../errors.js';

const superviseSession = async function ({
  sessionId,
  invigilatorPassword,
  userId,
  sessionRepository,
  supervisorAccessRepository,
  certificationCenterRepository,
  certificationPointOfContactRepository,
}) {
  // should use a specific get from sessionRepository instead
  const session = await sessionRepository.get({ id: sessionId });

  const certificationCenter = await certificationCenterRepository.getBySessionId({ sessionId });

  const [certificationCenterAccess] = await certificationPointOfContactRepository.getAllowedCenterAccesses({
    centerList: [certificationCenter],
  });

  if (certificationCenterAccess.isAccessBlockedUntilDate()) {
    throw new SessionNotAccessible(certificationCenterAccess.pixCertifBlockedAccessUntilDate);
  }

  if (!session.isSupervisable(invigilatorPassword)) {
    throw new InvalidSessionSupervisingLoginError();
  }

  if (!session.isAccessible()) {
    throw new SessionNotAccessible();
  }

  if (certificationCenter.archivedAt || certificationCenter.archivedBy) {
    throw new CertificationCenterIsArchivedError();
  }

  await supervisorAccessRepository.create({ sessionId, userId });
};

export { superviseSession };
