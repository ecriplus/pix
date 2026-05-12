import { usecases } from '../domain/usecases/index.js';
import * as certificationVersionDetailSerializer from '../infrastructure/serializers/certification-version-detail-serializer.js';

const getVersionById = async function (request) {
  const certificationVersionId = request.params.certificationVersionId;

  const certificationVersion = await usecases.getVersionById({
    id: certificationVersionId,
  });

  return certificationVersionDetailSerializer.serialize(certificationVersion);
};

const update = async function (request, h) {
  const certificationVersionId = request.params.certificationVersionId;
  const comments = request.payload.data.attributes.comments;

  await usecases.updateVersion({
    id: certificationVersionId,
    comments,
  });

  return h.response().code(204);
};

const certificationVersionController = {
  getVersionById,
  update,
};

export { certificationVersionController };
