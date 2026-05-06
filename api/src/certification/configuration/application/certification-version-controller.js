import { usecases } from '../domain/usecases/index.js';
import * as certificationVersionDetailSerializer from '../infrastructure/serializers/certification-version-detail-serializer.js';
import * as certificationVersionSerializer from '../infrastructure/serializers/certification-version-serializer.js';

const getActiveVersionByScope = async function (request) {
  const scope = request.params.scope;

  const activeCertificationVersion = await usecases.getActiveVersionByScope({ scope });

  return certificationVersionSerializer.serialize(activeCertificationVersion);
};

const getVersionById = async function (request) {
  const certificationVersionId = request.params.certificationVersionId;

  const certificationVersion = await usecases.getVersionById({ id: certificationVersionId });

  return certificationVersionDetailSerializer.serialize(certificationVersion);
};

const certificationVersionController = {
  getActiveVersionByScope,
  getVersionById,
};

export { certificationVersionController };
