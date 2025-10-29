import { usecases } from '../domain/usecases/index.js';
import * as certificationVersionSerializer from '../infrastructure/serializers/certification-version-serializer.js';

const getActiveVersionByScope = async function (request) {
  const scope = request.params.scope;

  const activeCertificationVersion = await usecases.getActiveVersionByScope({ scope });

  return certificationVersionSerializer.serialize(activeCertificationVersion);
};

const updateCertificationVersion = async function (request, h) {
  const updatedVersion = certificationVersionSerializer.deserialize(request.payload);
  updatedVersion.id = request.params.certificationVersionId;

  await usecases.updateCertificationVersion({ updatedVersion });

  return h.response().code(204);
};

const certificationVersionController = {
  getActiveVersionByScope,
  updateCertificationVersion,
};

export { certificationVersionController };
