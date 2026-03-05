/**
 * @typedef {import('../models/Session.js').Session} Session
 *  @typedef {import('./index.js').JuryCertificationSummaryRepository} JuryCertificationSummaryRepository
 *  @typedef {import('./index.js').FinalizedSessionRepository} FinalizedSessionRepository
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { FinalizedSession } from '../models/FinalizedSession.js';

export const registerPublishableSession = withTransaction(
  /**
   * @param {object} params
   * @param {Session} params.session
   * @param {JuryCertificationSummaryRepository} params.juryCertificationSummaryRepository
   * @param {FinalizedSessionRepository} params.finalizedSessionRepository
   */
  async ({ session, juryCertificationSummaryRepository, finalizedSessionRepository }) => {
    const juryCertificationSummaries = await juryCertificationSummaryRepository.findBySessionId({
      sessionId: session.id,
    });

    const finalizedSession = FinalizedSession.from({
      sessionId: session.id,
      finalizedAt: session.finalizedAt,
      certificationCenterName: session.certificationCenterName,
      sessionDate: session.date,
      sessionTime: session.time,
      hasExaminerGlobalComment: session.hasExaminerGlobalComment,
      juryCertificationSummaries,
    });

    await finalizedSessionRepository.save({ finalizedSession });
  },
);
