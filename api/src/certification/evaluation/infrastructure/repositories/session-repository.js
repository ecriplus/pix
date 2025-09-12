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
  const certificationCourseDTO = await knexConn('certification-courses').where('id', certificationCourseId).first();

  if (!certificationCourseDTO) {
    throw new NotFoundError('Certification course does not exist');
  }

  const sessionDTO = await knexConn('sessions')
    .select('id', 'accessCode', 'finalizedAt', 'publishedAt')
    .where('id', certificationCourseDTO.sessionId)
    .first();

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
