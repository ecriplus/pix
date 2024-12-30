import { datamartKnex } from '../../../../db/knex-database-connection.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { CertificationResult } from '../../domain/read-models/CertificationResult.js';

const get = async ({ ine }) => {
  const certificationResultDto = await datamartKnex('data_export_parcoursup_certif_result').where({
    national_student_id: ine,
  });
  if (!certificationResultDto.length) {
    throw new NotFoundError('No certifications found for given INE');
  }

  return _toDomain(certificationResultDto);
};

const _toDomain = (certificationResultDto) => {
  return new CertificationResult({
    ine: certificationResultDto[0].national_student_id,
    organizationUai: certificationResultDto[0].organization_uai,
    lastName: certificationResultDto[0].last_name,
    firstName: certificationResultDto[0].first_name,
    birthdate: certificationResultDto[0].birthdate,
    status: certificationResultDto[0].status,
    pixScore: certificationResultDto[0].pix_score,
    certificationDate: certificationResultDto[0].certification_date,
    competences: certificationResultDto.map((certificationResultDto) => {
      return {
        id: certificationResultDto.competence_id,
        level: certificationResultDto.competence_level,
      };
    }),
  });
};

export { get };
