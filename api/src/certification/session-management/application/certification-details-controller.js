import { usecases } from '../domain/usecases/index.js';
import * as certificationDetailsSerializer from '../infrastructure/serializers/certification-details-serializer.js';

async function getCertificationDetails (request, h, dependencies = { certificationDetailsSerializer }) {
  const certificationCourseId = request.params.certificationCourseId;
  const certificationDetails = await usecases.getCertificationDetails({ certificationCourseId });

  return dependencies.certificationDetailsSerializer.serialize(certificationDetails);
};

export const certificationDetailsController = {
  getCertificationDetails,
};
