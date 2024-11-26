import { usecases } from '../domain/usecases/index.js';
import * as participationsByStageSerializer from '../infrastructure/serializers/jsonapi/campaign-participations-count-by-stage-serializer.js';
import * as participationsByDaySerializer from '../infrastructure/serializers/jsonapi/campaign-participations-counts-by-day-serializer.js';
import * as participationsByStatusSerializer from '../infrastructure/serializers/jsonapi/campaign-participations-counts-by-status-serializer.js';
import * as participationsCountByMasteryRateSerializer from '../infrastructure/serializers/jsonapi/participations-count-by-mastery-rate.js';

const getParticipationsByStage = async function (request) {
  const { userId } = request.auth.credentials;
  const { campaignId } = request.params;

  const participationsByStage = await usecases.getCampaignParticipationsCountByStage({ userId, campaignId });

  return participationsByStageSerializer.serialize({
    campaignId,
    data: participationsByStage,
  });
};

const getParticipationsByStatus = async function (request) {
  const { userId } = request.auth.credentials;
  const { campaignId } = request.params;

  const participantsCounts = await usecases.getCampaignParticipationsCountsByStatus({ userId, campaignId });

  return participationsByStatusSerializer.serialize({
    campaignId,
    ...participantsCounts,
  });
};
const getParticipationsByDay = async function (request) {
  const { userId } = request.auth.credentials;
  const { campaignId } = request.params;

  const participantsCounts = await usecases.getCampaignParticipationsActivityByDay({ userId, campaignId });

  return participationsByDaySerializer.serialize({
    campaignId,
    ...participantsCounts,
  });
};

const getParticipationsCountByMasteryRate = async function (request) {
  const { userId } = request.auth.credentials;
  const { campaignId } = request.params;

  const resultDistribution = await usecases.getParticipationsCountByMasteryRate({ userId, campaignId });

  return participationsCountByMasteryRateSerializer.serialize({
    campaignId,
    resultDistribution,
  });
};

const campaignStatsController = {
  getParticipationsByStage,
  getParticipationsByStatus,
  getParticipationsByDay,
  getParticipationsCountByMasteryRate,
};

export { campaignStatsController };
