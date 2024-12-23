import { datamartBuffer } from '../datamart-buffer.js';

const buildCertificationResult = function ({ nationalStudentId } = {}) {
  const values = {
    national_student_id: nationalStudentId,
  };

  datamartBuffer.pushInsertable({
    tableName: 'data_export_parcoursup_certif_result',
    values,
  });

  return {
    nationalStudentId,
  };
};

export { buildCertificationResult };
