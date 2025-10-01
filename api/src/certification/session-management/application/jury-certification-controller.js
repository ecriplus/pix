import { getI18nFromRequest } from '../../../shared/infrastructure/i18n/i18n.js';
import { usecases } from '../domain/usecases/index.js';
import * as juryCertificationSerializer from '../infrastructure/serializers/jury-certification-serializer.js';

const getJuryCertification = async function (request, h, dependencies = { juryCertificationSerializer }) {
  const i18n = getI18nFromRequest(request);

  const certificationCourseId = request.params.certificationCourseId;
  const juryCertification = await usecases.getJuryCertification({ certificationCourseId });

  return dependencies.juryCertificationSerializer.serialize(juryCertification, { translate: i18n.__ });
};

const juryCertificationController = {
  getJuryCertification,
};

export { juryCertificationController };
