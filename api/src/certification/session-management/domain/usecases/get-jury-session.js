/**
 * @typedef {import('./index.js').JurySessionRepository} JurySessionRepository
 * @typedef {import('./index.js').SupervisorAccessRepository} SupervisorAccessRepository
 */

/**
 * @param {Object} params
 * @param {JurySessionRepository} params.jurySessionRepository
 * @param {SupervisorAccessRepository} params.supervisorAccessRepository
 */
const getJurySession = async function ({ sessionId, jurySessionRepository }) {
  const jurySession = await jurySessionRepository.get({ id: sessionId });
  return {
    jurySession,
  };
};

export { getJurySession };
