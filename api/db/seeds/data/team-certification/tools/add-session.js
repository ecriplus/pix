/**
 * @typedef {import('../../../../../src/certification/enrolment/domain/models/SessionEnrolment.js').SessionEnrolment} SessionEnrolment
 */
import { usecases as enrolmentUseCases } from '../../../../../src/certification/enrolment/domain/usecases/index.js';

/**
 * @param {Object} params
 * @param {Object} params.databaseBuilder
 * @param {number} params.createdBy - certification center member user id
 * @param {number} params.certificationCenterId
 * @param {number} params.[forceSessionId] - allow for a stable and fixed session ID
 * @param {SessionEnrolment} params.[session] - session details you can customize
 * @returns {Promise<SessionEnrolment>}
 */
export default async function addSession({ databaseBuilder, createdByUserId, forceSessionId, session }) {
  const generatedSession = await enrolmentUseCases.createSession({
    userId: createdByUserId,
    session,
  });
  await databaseBuilder
    .knex('sessions')
    .where('id', generatedSession.id)
    .update({
      id: forceSessionId || generatedSession.id,
      accessCode: 'AZERTY',
    });
  await databaseBuilder.commit();

  return enrolmentUseCases.getSession({ sessionId: forceSessionId });
}
