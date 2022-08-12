// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionNot... Remove this comment to see the full error message
const { SessionNotAccessible, InvalidSessionSupervisingLoginError } = require('../errors');
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function superviseSession({
  sessionId,
  supervisorPassword,
  userId,
  sessionRepository,
  supervisorAccessRepository
}: $TSFixMe) {
  const session = await sessionRepository.get(sessionId);
  if (!session.isSupervisable(supervisorPassword)) {
    throw new InvalidSessionSupervisingLoginError();
  }
  if (!session.isAccessible()) {
    throw new SessionNotAccessible();
  }
  await supervisorAccessRepository.create({ sessionId, userId });
};
