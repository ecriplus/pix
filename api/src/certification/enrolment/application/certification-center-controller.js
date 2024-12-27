import { usecases } from '../domain/usecases/index.js';
import * as studentCertificationSerializer from '../infrastructure/serializers/student-certification-serializer.js';

const getStudents = async function (request) {
  const certificationCenterId = request.params.certificationCenterId;
  const sessionId = request.params.sessionId;

  const { filter, page } = request.query;
  if (filter.divisions && !Array.isArray(filter.divisions)) {
    filter.divisions = [filter.divisions];
  }

  const { data, pagination } = await usecases.findStudentsForEnrolment({
    certificationCenterId,
    sessionId,
    page,
    filter,
  });
  return studentCertificationSerializer.serialize(data, pagination);
};

const certificationCenterController = { getStudents };

export { certificationCenterController };
