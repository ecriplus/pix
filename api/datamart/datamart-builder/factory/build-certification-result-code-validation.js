import { datamartBuffer } from '../datamart-buffer.js';

const buildCertificationResultCodeValidation = function ({
  verificationCode,
  lastName,
  firstName,
  birthdate,
  status,
  pixScore,
  certificationDate,
  competenceId,
  competenceLevel,
} = {}) {
  const values = {
    certification_code_verification: verificationCode,
    last_name: lastName,
    first_name: firstName,
    birthdate,
    status,
    pix_score: pixScore,
    certification_date: certificationDate,
    competence_id: competenceId,
    competence_level: competenceLevel,
  };

  datamartBuffer.pushInsertable({
    tableName: 'data_export_parcoursup_certif_result_code_validation',
    values,
  });
};

export { buildCertificationResultCodeValidation };
