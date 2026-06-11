/**
 * @typedef {import('./index.js').SessionRepository} SessionRepository
 * @typedef {import('./index.js').CandidateRepository} CandidateRepository
 * @typedef {import('./index.js').CenterRepository} CenterRepository
 */
import { Candidate } from '../models/Candidate.js';
/**
 * @param {object} params
 * @param {SessionRepository} params.sessionRepository
 * @param {CandidateRepository} params.candidateRepository
 * @param {CenterRepository} params.centerRepository
 */
export async function getCandidateImportSheetData({
  sessionId,
  sessionRepository,
  candidateRepository,
  centerRepository,
}) {
  const session = await sessionRepository.get({ id: sessionId });
  let enrolledCandidates = await candidateRepository.findBySessionId({ sessionId });
  enrolledCandidates = enrolledCandidates.sort(Candidate.sortByLastNameAndFirstName);
  const center = await centerRepository.getById({ id: session.certificationCenterId });
  return {
    session,
    enrolledCandidates,
    certificationCenterHabilitations: center.habilitations,
    isScoCertificationCenter: center.isSco,
  };
}
