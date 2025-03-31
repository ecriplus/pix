const getSession = async function ({ sessionId, sessionRepository }) {
  const session = await sessionRepository.get({ id: sessionId });
  const hasSomeCleaAcquired = await sessionRepository.hasSomeCleaAcquired({ id: sessionId });
  return {
    session,
    hasSomeCleaAcquired,
  };
};

export { getSession };
