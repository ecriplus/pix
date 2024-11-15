import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';

/**
 * @returns {Promise<number>} updated sessions count
 */
export const updateV2SessionsWithNoCourses = async function () {
  const knexConn = DomainTransaction.getConnection();

  const updatedSessions = await knexConn('sessions')
    .update({ version: 3 }, ['id'])
    .whereIn('id', function () {
      this.select('sessions.id')
        .from('sessions')
        .leftJoin('certification-courses', 'sessions.id', 'certification-courses.sessionId')
        .where('sessions.version', 2)
        .whereNull('certification-courses.sessionId')
        .join('certification-centers', 'certification-centers.id', 'sessions.certificationCenterId')
        .where('certification-centers.isV3Pilot', true);
    });

  return updatedSessions.length;
};

/**
 * @returns {Promise<Array<number>>} ids of v2 sessions with no courses
 */
export const findV2SessionIdsWithNoCourses = async function () {
  const knexConn = DomainTransaction.getConnection();

  const sessions = await knexConn('sessions')
    .select('id')
    .whereIn('id', function () {
      this.select('sessions.id')
        .from('sessions')
        .leftJoin('certification-courses', 'sessions.id', 'certification-courses.sessionId')
        .where('sessions.version', 2)
        .whereNull('certification-courses.sessionId')
        .join('certification-centers', 'certification-centers.id', 'sessions.certificationCenterId')
        .where('certification-centers.isV3Pilot', true);
    });

  return sessions.map(({ id }) => id);
};
