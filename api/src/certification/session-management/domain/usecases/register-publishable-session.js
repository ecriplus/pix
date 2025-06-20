/**
 * @typedef {import('../read-models/SessionFinalized.js').SessionFinalized} SessionFinalized
 *  @typedef {import('./index.js').JuryCertificationSummaryRepository} JuryCertificationSummaryRepository
 *  @typedef {import('./index.js').FinalizedSessionRepository} FinalizedSessionRepository
 */

import { FinalizedSession } from '../models/FinalizedSession.js';

/**
 * @param {Object} params
 * @param {SessionFinalized} params.sessionFinalized
 * @param {JuryCertificationSummaryRepository} params.juryCertificationSummaryRepository
 * @param {FinalizedSessionRepository} params.finalizedSessionRepository
 */
export const registerPublishableSession = async ({
  sessionFinalized,
  juryCertificationSummaryRepository,
  finalizedSessionRepository,
}) => {
  const juryCertificationSummaries = await juryCertificationSummaryRepository.findBySessionId({
    sessionId: sessionFinalized.sessionId,
  });

  const finalizedSession = FinalizedSession.from({
    sessionId: sessionFinalized.sessionId,
    finalizedAt: sessionFinalized.finalizedAt,
    certificationCenterName: sessionFinalized.certificationCenterName,
    sessionDate: sessionFinalized.sessionDate,
    sessionTime: sessionFinalized.sessionTime,
    hasExaminerGlobalComment: sessionFinalized.hasExaminerGlobalComment,
    juryCertificationSummaries,
  });

  await finalizedSessionRepository.save({ finalizedSession });
};
