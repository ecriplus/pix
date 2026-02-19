const getSession = async function ({ sessionId, sessionManagementRepository }) {
  const session = await sessionManagementRepository.get({ id: sessionId });
  const hasSomeCleaAcquired = await sessionManagementRepository.hasSomeCleaAcquired({ id: sessionId });
  return {
    session,
    hasSomeCleaAcquired,
  };
};

export { getSession };
