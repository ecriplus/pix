import * as sessionValidator from '../../shared/domain/validators/session-validator.js';
import { usecases } from '../domain/usecases/index.js';
import * as juryCertificationSummaryRepository from '../infrastructure/repositories/jury-certification-summary-repository.js';
import * as jurySessionRepository from '../infrastructure/repositories/jury-session-repository.js';
import * as juryCertificationSummarySerializer from '../infrastructure/serializers/jury-certification-summary-serializer.js';
import * as jurySessionSerializer from '../infrastructure/serializers/jury-session-serializer.js';
import * as sessionSerializer from '../infrastructure/serializers/session-serializer.js';

const get = async function (request, h, dependencies = { sessionSerializer }) {
  const sessionId = request.params.sessionId;
  const { session, hasSomeCleaAcquired } = await usecases.getSession({ sessionId });
  return dependencies.sessionSerializer.serialize({ session, hasSomeCleaAcquired });
};

const findPaginatedFilteredJurySessions = async function (
  request,
  h,
  dependencies = {
    jurySessionRepository,
    jurySessionSerializer,
    sessionValidator,
  },
) {
  const { filter, page } = request.query;
  const normalizedFilters = dependencies.sessionValidator.validateAndNormalizeFilters(filter);
  const jurySessionsForPaginatedList = await dependencies.jurySessionRepository.findPaginatedFiltered({
    filters: normalizedFilters,
    page,
  });

  return dependencies.jurySessionSerializer.serializeForPaginatedList(jurySessionsForPaginatedList);
};

const getJurySession = async function (request, h, dependencies = { jurySessionSerializer }) {
  const sessionId = request.params.sessionId;
  const jurySession = await usecases.getJurySession({ sessionId });

  return dependencies.jurySessionSerializer.serialize(jurySession);
};

const getJuryCertificationSummaries = async function (
  request,
  h,
  dependencies = {
    juryCertificationSummaryRepository,
    juryCertificationSummarySerializer,
  },
) {
  const { sessionId } = request.params;
  const { page } = request.query;
  const translate = request.i18n.__;

  const { juryCertificationSummaries, pagination } =
    await dependencies.juryCertificationSummaryRepository.findBySessionIdPaginated({
      sessionId,
      page,
    });
  return dependencies.juryCertificationSummarySerializer.serialize(juryCertificationSummaries, pagination, {
    translate,
  });
};

const sessionController = {
  getJuryCertificationSummaries,
  findPaginatedFilteredJurySessions,
  get,
  getJurySession,
};

export { sessionController };
