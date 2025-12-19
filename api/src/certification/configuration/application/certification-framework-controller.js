import { usecases } from '../domain/usecases/index.js';
import * as certificationFrameworkSerializer from '../infrastructure/serializers/certification-framework-serializer.js';

const findCertificationFrameworks = async function () {
  const frameworks = await usecases.findCertificationFrameworks();
  return certificationFrameworkSerializer.serialize(frameworks);
};

const certificationFrameworkController = {
  findCertificationFrameworks,
};

export { certificationFrameworkController };
