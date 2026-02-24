import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';
import { Session } from '../../domain/models/Session.js';

export const get = async ({ id }) => {
  const knexConn = DomainTransaction.getConnection();
  const sessionDTO = await knexConn('sessions')
    .select('id', 'accessCode', 'finalizedAt', 'publishedAt')
    .where('id', id)
    .first();

  if (!sessionDTO) {
    throw new NotFoundError('Session does not exist');
  }

  return _toDomain(sessionDTO);
};

export const getByCertificationCourseId = async ({ certificationCourseId }) => {
  const knexConn = DomainTransaction.getConnection();
  const sessionDTO = await knexConn('sessions')
    .select({
      id: 'sessions.id',
      accessCode: 'sessions.accessCode',
      finalizedAt: 'sessions.finalizedAt',
      publishedAt: 'sessions.publishedAt',
    })
    .join('certification-courses', 'certification-courses.sessionId', 'sessions.id')
    .where('certification-courses.id', certificationCourseId)
    .first();

  if (!sessionDTO) {
    throw new NotFoundError('Certification course does not exist');
  }

  return _toDomain(sessionDTO);
};

const _toDomain = (sessionDTO) => {
  return new Session({
    id: sessionDTO.id,
    accessCode: sessionDTO.accessCode,
    finalizedAt: !!sessionDTO.finalizedAt,
    publishedAt: !!sessionDTO.publishedAt,
  });
};
