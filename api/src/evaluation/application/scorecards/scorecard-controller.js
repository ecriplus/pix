// TODO Bounded context violation
import { usecases as devCompUsecases } from '../../../devcomp/domain/usecases/index.js';
// TODO Bounded context violation
import * as tutorialSerializer from '../../../devcomp/infrastructure/serializers/jsonapi/tutorial-serializer.js';
import { evaluationUsecases } from '../../../evaluation/domain/usecases/index.js';
import * as requestResponseUtils from '../../../shared/infrastructure/utils/request-response-utils.js';
import * as scorecardSerializer from '../../infrastructure/serializers/jsonapi/scorecard-serializer.js';

const getScorecard = function (request, h, dependencies = { requestResponseUtils, scorecardSerializer }) {
  const locale = dependencies.requestResponseUtils.extractLocaleFromRequest(request);
  const authenticatedUserId = request.auth.credentials.userId;
  const scorecardId = request.params.id;

  return evaluationUsecases
    .getScorecard({
      authenticatedUserId,
      scorecardId,
      locale,
    })
    .then(dependencies.scorecardSerializer.serialize);
};

const findTutorials = function (request, h, dependencies = { requestResponseUtils, tutorialSerializer }) {
  const locale = dependencies.requestResponseUtils.extractLocaleFromRequest(request);
  const authenticatedUserId = request.auth.credentials.userId;
  const scorecardId = request.params.id;

  return devCompUsecases
    .findTutorials({
      authenticatedUserId,
      scorecardId,
      locale,
    })
    .then(dependencies.tutorialSerializer.serialize);
};

const resetScorecard = function (request, h, dependencies = { scorecardSerializer, requestResponseUtils }) {
  const authenticatedUserId = request.auth.credentials.userId;
  const competenceId = request.params.competenceId;
  const locale = dependencies.requestResponseUtils.extractLocaleFromRequest(request);

  return evaluationUsecases
    .resetScorecard({ userId: authenticatedUserId, competenceId, locale })
    .then(dependencies.scorecardSerializer.serialize);
};

const scorecardController = { getScorecard, findTutorials, resetScorecard };
export { scorecardController };
