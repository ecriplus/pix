import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';
import { Session } from '../../domain/models/Session.js';

const getByCertificationCourseId = async ({ certificationCourseId }) => {
  const knexConn = DomainTransaction.getConnection();
  const certificationCourseDTO = await knexConn('certification-courses').where('id', certificationCourseId).first();

  if (!certificationCourseDTO) {
    throw new NotFoundError('Certification course does not exist');
  }

  const sessionDTO = await knexConn('sessions').where('id', certificationCourseDTO.sessionId).first();

  return _toDomain(sessionDTO);
};

function _toDomain(sessionDTO) {
  return new Session(sessionDTO);
}

export { getByCertificationCourseId };
