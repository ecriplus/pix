import { NotFoundError } from '../../domain/errors.js';

const flagSessionResultsAsSentToPrescriber = async function ({ sessionId, sessionRepository }) {
  const integerSessionId = parseInt(sessionId);
  const NOT_FOUND_SESSION = `La session ${sessionId} n'existe pas ou son accès est restreint lors du marquage d'envoi des résultats au prescripteur`;

  if (!Number.isFinite(integerSessionId)) {
    throw new NotFoundError(NOT_FOUND_SESSION);
  }

  let session = await sessionRepository.get({ id: sessionId });

  if (!session.areResultsFlaggedAsSent()) {
    session = await sessionRepository.flagResultsAsSentToPrescriber({
      id: sessionId,
      resultsSentToPrescriberAt: new Date(),
    });
    return { resultsFlaggedAsSent: true, session };
  }

  return { resultsFlaggedAsSent: false, session };
};

export { flagSessionResultsAsSentToPrescriber };
