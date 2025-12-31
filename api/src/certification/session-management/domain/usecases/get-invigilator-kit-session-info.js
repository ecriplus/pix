/**
 * @typedef {import('./index.js').SessionForInvigilatorKitRepository} SessionForInvigilatorKitRepository
 */

/**
 * @param {object} params
 * @param {SessionForInvigilatorKitRepository} params.sessionForInvigilatorKitRepository
 */
const getInvigilatorKitSessionInfo = async function ({ sessionId, sessionForInvigilatorKitRepository }) {
  return sessionForInvigilatorKitRepository.get({ id: sessionId });
};

export { getInvigilatorKitSessionInfo };
