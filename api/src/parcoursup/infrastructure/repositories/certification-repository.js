import { datamartKnex } from '../../../../db/knex-database-connection.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { CertificationResult } from '../../domain/read-models/CertificationResult.js';

const get = async ({ ine }) => {
  const certificationResultDto = await datamartKnex('data_export_parcoursup_certif_result')
    .where({ national_student_id: ine })
    .limit(1)
    .first();
  if (!certificationResultDto) {
    throw new NotFoundError('No certifications found for given INE');
  }
  return new CertificationResult({ ine: certificationResultDto.national_student_id });
};

export { get };
