import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';
import { CertificationCourse } from '../../../shared/domain/models/CertificationCourse.js';

async function getByVerificationCode({ verificationCode }) {
  const knexConn = DomainTransaction.getConnection();

  const certificationCourse = await knexConn('certification-courses').select('*').where({ verificationCode }).first();

  if (!certificationCourse) {
    throw new NotFoundError(`Certification course does not exist with given verification code`);
  }

  return new CertificationCourse(certificationCourse);
}

export { getByVerificationCode };
