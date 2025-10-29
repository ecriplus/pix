import { usecases } from '../domain/usecases/index.js';
import { Version } from '../domain/models/Version.js';

const updateCertificationVersion = async function (request, h) {
  const updatedVersion = certificationVersionSerializer.deserialize(request.payload);
  updatedVersion.id = request.params.certificationVersionId;

  await usecases.updateCertificationVersion({ updatedVersion });

  return h.response().code(204);
};

const certificationVersionController = {
  updateCertificationVersion,
};

export { certificationVersionController };
