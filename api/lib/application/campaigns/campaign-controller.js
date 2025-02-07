import * as campaignAnalysisSerializer from '../../../src/prescription/campaign-participation/infrastructure/serializers/jsonapi/campaign-analysis-serializer.js';
import { extractParameters } from '../../../src/shared/infrastructure/utils/query-params-utils.js';
import { usecases } from '../../domain/usecases/index.js';
import * as campaignCollectiveResultSerializer from '../../infrastructure/serializers/jsonapi/campaign-collective-result-serializer.js';
import * as campaignToJoinSerializer from '../../infrastructure/serializers/jsonapi/campaign-to-join-serializer.js';
import * as divisionSerializer from '../../infrastructure/serializers/jsonapi/division-serializer.js';
import * as groupSerializer from '../../infrastructure/serializers/jsonapi/group-serializer.js';
import { extractLocaleFromRequest } from '../../infrastructure/utils/request-response-utils.js';
import { MissingQueryParamError } from '../http-errors.js';

const getByCode = async function (request) {
  const filters = extractParameters(request.query).filter;
  await _validateFilters(filters);

  const campaignToJoin = await usecases.getCampaignByCode({ code: filters.code });
  return campaignToJoinSerializer.serialize(campaignToJoin);
};

const getCollectiveResult = async function (request, h, dependencies = { campaignCollectiveResultSerializer }) {
  const { userId } = request.auth.credentials;
  const campaignId = request.params.id;
  const locale = extractLocaleFromRequest(request);

  const campaignCollectiveResult = await usecases.computeCampaignCollectiveResult({ userId, campaignId, locale });
  return dependencies.campaignCollectiveResultSerializer.serialize(campaignCollectiveResult);
};

const getAnalysis = async function (request, h, dependencies = { campaignAnalysisSerializer }) {
  const { userId } = request.auth.credentials;
  const campaignId = request.params.id;
  const locale = extractLocaleFromRequest(request);

  const campaignAnalysis = await usecases.computeCampaignAnalysis({ userId, campaignId, locale });
  return dependencies.campaignAnalysisSerializer.serialize(campaignAnalysis);
};

const division = async function (request) {
  const { userId } = request.auth.credentials;
  const campaignId = request.params.id;

  const divisions = await usecases.getParticipantsDivision({ userId, campaignId });
  return divisionSerializer.serialize(divisions);
};

const getGroups = async function (request) {
  const { userId } = request.auth.credentials;
  const campaignId = request.params.id;

  const groups = await usecases.getParticipantsGroup({ userId, campaignId });
  return groupSerializer.serialize(groups);
};

const campaignController = {
  getByCode,
  getCollectiveResult,
  getAnalysis,
  division,
  getGroups,
};

export { campaignController };

function _validateFilters(filters) {
  if (typeof filters.code === 'undefined') {
    throw new MissingQueryParamError('filter.code');
  }
}
