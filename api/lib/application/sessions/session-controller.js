import * as juryCertificationSummaryRepository from '../../../src/certification/session-management/infrastructure/repositories/jury-certification-summary-repository.js';
import * as juryCertificationSummarySerializer from '../../infrastructure/serializers/jsonapi/jury-certification-summary-serializer.js';

const getJuryCertificationSummaries = async function (
  request,
  h,
  dependencies = {
    juryCertificationSummaryRepository,
    juryCertificationSummarySerializer,
  },
) {
  const sessionId = request.params.id;
  const { page } = request.query;

  const { juryCertificationSummaries, pagination } =
    await dependencies.juryCertificationSummaryRepository.findBySessionIdPaginated({
      sessionId,
      page,
    });
  return dependencies.juryCertificationSummarySerializer.serialize(juryCertificationSummaries, pagination);
};

const sessionController = {
  getJuryCertificationSummaries,
};

export { sessionController };
