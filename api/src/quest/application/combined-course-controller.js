import { config } from '../../shared/config.js';
import { requestResponseUtils } from '../../shared/infrastructure/utils/request-response-utils.js';
import { usecases } from '../domain/usecases/index.js';
import * as combinedCourseSerializer from '../infrastructure/serializers/combined-course-serializer.js';

const getByCode = async function (request, _, dependencies = { requestResponseUtils, combinedCourseSerializer }) {
  const { code } = request.query.filter;
  const userId = dependencies.requestResponseUtils.extractUserIdFromRequest(request);
  const TLD = dependencies.requestResponseUtils.extractTLDFromRequest(request);
  const appDomain = config.domain.pixApp;
  const hostURL = TLD ? `${appDomain}.${TLD}` : appDomain;
  const combinedCourse = await usecases.getCombinedCourseByCode({ userId, code, hostURL });
  return dependencies.combinedCourseSerializer.serialize(combinedCourse);
};

const start = async function (request, h, dependencies = { requestResponseUtils }) {
  const userId = dependencies.requestResponseUtils.extractUserIdFromRequest(request);
  const code = request.params.code;

  await usecases.startCombinedCourse({
    userId,
    code,
  });

  return h.response().code(204);
};

const reassessStatus = async function (request, h, dependencies = { requestResponseUtils }) {
  const userId = dependencies.requestResponseUtils.extractUserIdFromRequest(request);
  const code = request.params.code;

  await usecases.updateCombinedCourse({
    userId,
    code,
  });

  return h.response().code(204);
};

const combinedCourseController = {
  getByCode,
  start,
  reassessStatus,
};

export { combinedCourseController };
