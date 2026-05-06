import { usecases } from '../domain/usecases/index.js';
import * as certificationVersionDetailSerializer from '../infrastructure/serializers/certification-version-detail-serializer.js';

const getVersionById = async function (request) {
  const certificationVersionId = request.params.certificationVersionId;

  const certificationVersion = await usecases.getVersionById({ id: certificationVersionId });

  return certificationVersionDetailSerializer.serialize(certificationVersion);
};

const certificationVersionController = {
  getVersionById,
};

export { certificationVersionController };
