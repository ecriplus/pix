import { InvalidSessionSupervisingLoginError, SessionNotAccessible } from '../errors.js';

const superviseSession = async function ({
  sessionId,
  supervisorPassword,
  userId,
  sessionRepository,
  supervisorAccessRepository,
}) {
  const session = await sessionRepository.get({ id: sessionId });
  if (!session.isSupervisable(supervisorPassword)) {
    throw new InvalidSessionSupervisingLoginError();
  }
  if (!session.isAccessible()) {
    throw new SessionNotAccessible();
  }
  await supervisorAccessRepository.create({ sessionId, userId });
};

export { superviseSession };
