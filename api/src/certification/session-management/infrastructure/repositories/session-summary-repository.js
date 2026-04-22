import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { fetchPage } from '../../../../shared/infrastructure/utils/knex-utils.js';
import { SESSION_STATUSES } from '../../../shared/domain/constants.js';
import { SessionSummary } from '../../domain/read-models/SessionSummary.js';

export async function findPaginatedFilteredByCertificationCenterId({ certificationCenterId, filters = {}, page }) {
  const knexConn = DomainTransaction.getConnection();
  const query = knexConn('sessions')
    .select({
      id: 'sessions.id',
      address: 'sessions.address',
      room: 'sessions.room',
      date: 'sessions.date',
      time: 'sessions.time',
      examiner: 'sessions.examiner',
      finalizedAt: 'sessions.finalizedAt',
      publishedAt: 'sessions.publishedAt',
      createdAt: 'sessions.createdAt',
    })
    .select(
      knexConn.raw('COUNT("certification-candidates"."id") AS "enrolledCandidatesCount"'),
      knexConn.raw('COUNT("certification-courses"."id") AS "effectiveCandidatesCount"'),
    )
    .leftJoin('certification-candidates', 'certification-candidates.sessionId', 'sessions.id')
    .leftJoin('certification-courses', function () {
      this.on('certification-courses.userId', 'certification-candidates.userId').andOn(
        'certification-courses.sessionId',
        'certification-candidates.sessionId',
      );
    })
    .where({ certificationCenterId })
    .modify(_setupFilters, filters)
    .groupBy('sessions.id')
    .orderBy('sessions.date', 'DESC')
    .orderBy('sessions.time', 'DESC')
    .orderBy('sessions.id', 'ASC');

  const { results, pagination } = await fetchPage({
    queryBuilder: query,
    paginationParams: page,
  });

  const { row_count } = await knexConn('sessions')
    .where({ certificationCenterId })
    .count('*', { as: 'row_count' })
    .first();
  const hasSessions = Boolean(row_count);

  const sessionSummaries = results.map((result) => SessionSummary.from(result));
  return { models: sessionSummaries, meta: { ...pagination, hasSessions } };
}

function _setupFilters(query, filters) {
  const { sessionId, status } = filters;

  if (sessionId) {
    query.where('sessions.id', sessionId);
  }

  if (status === SESSION_STATUSES.CREATED) {
    query.whereNull('finalizedAt');
    query.whereNull('publishedAt');
  }
  if (status === SESSION_STATUSES.FINALIZED) {
    query.whereNotNull('finalizedAt');
    query.whereNull('publishedAt');
  }
  if (status === SESSION_STATUSES.PROCESSED) {
    query.whereNotNull('publishedAt');
  }
}
