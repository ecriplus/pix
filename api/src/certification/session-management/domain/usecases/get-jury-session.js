/**
 * @typedef {import('./index.js').JurySessionRepository} JurySessionRepository
 * @typedef {import('./index.js').SupervisorAccessRepository} SupervisorAccessRepository
 * @typedef {import('../models/JurySession.js').JurySession} JurySession
 */

/**
 * @param {Object} params
 * @param {JurySessionRepository} params.jurySessionRepository
 * @param {SupervisorAccessRepository} params.supervisorAccessRepository
 * @returns {JurySession}
 */
const getJurySession = async function ({ sessionId, jurySessionRepository }) {
  return jurySessionRepository.get({ id: sessionId });
};

export { getJurySession };
