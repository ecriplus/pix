/**
 * @typedef {import('../events/AutoJuryDone.js').AutoJuryDone} AutoJuryDone
 *  @typedef {import('./index.js').JuryCertificationSummaryRepository} JuryCertificationSummaryRepository
 *  @typedef {import('./index.js').FinalizedSessionRepository} FinalizedSessionRepository
 *  @typedef {import('./index.js').SupervisorAccessRepository} SupervisorAccessRepository
 */

import { FinalizedSession } from '../models/FinalizedSession.js';

/**
 * @param {Object} params
 * @param {AutoJuryDone} params.autoJuryDone
 * @param {JuryCertificationSummaryRepository} params.juryCertificationSummaryRepository
 * @param {FinalizedSessionRepository} params.finalizedSessionRepository
 */
export const registerPublishableSession = async ({
  autoJuryDone,
  juryCertificationSummaryRepository,
  finalizedSessionRepository,
}) => {
  const juryCertificationSummaries = await juryCertificationSummaryRepository.findBySessionId({
    sessionId: autoJuryDone.sessionId,
  });

  const finalizedSession = FinalizedSession.from({
    sessionId: autoJuryDone.sessionId,
    finalizedAt: autoJuryDone.finalizedAt,
    certificationCenterName: autoJuryDone.certificationCenterName,
    sessionDate: autoJuryDone.sessionDate,
    sessionTime: autoJuryDone.sessionTime,
    hasExaminerGlobalComment: autoJuryDone.hasExaminerGlobalComment,
    juryCertificationSummaries,
  });

  await finalizedSessionRepository.save({ finalizedSession });
};
