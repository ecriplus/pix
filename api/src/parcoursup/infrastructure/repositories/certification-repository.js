import { datamartKnex } from '../../../../db/knex-database-connection.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { CertificationResult } from '../../domain/read-models/CertificationResult.js';

const getByINE = async ({ ine }) => {
  return _getBySearchParams({
    national_student_id: ine,
  });
};

const getByOrganizationUAI = async ({ organizationUai, lastName, firstName, birthdate }) => {
  return _getBySearchParams({
    organization_uai: organizationUai,
    last_name: lastName,
    first_name: firstName,
    birthdate,
  });
};

const _getBySearchParams = async (searchParams) => {
  const certificationResultDto = await datamartKnex('data_export_parcoursup_certif_result').where(searchParams);
  if (!certificationResultDto.length) {
    throw new NotFoundError('No certifications found for given search parameters');
  }

  return _toDomain(certificationResultDto);
};

const getByVerificationCode = async ({ verificationCode }) => {
  const certificationResultDto = await datamartKnex('data_export_parcoursup_certif_result_code_validation').where({
    certification_code_verification: verificationCode,
  });
  if (!certificationResultDto.length) {
    throw new NotFoundError('No certifications found for given search parameters');
  }

  return _toDomain(certificationResultDto);
};

const _toDomain = (certificationResultDto) => {
  return new CertificationResult({
    ine: certificationResultDto[0].national_student_id,
    organizationUai: certificationResultDto[0].organization_uai,
    verificationCode: certificationResultDto[0].verificationCode,
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

export { getByINE, getByOrganizationUAI, getByVerificationCode };
