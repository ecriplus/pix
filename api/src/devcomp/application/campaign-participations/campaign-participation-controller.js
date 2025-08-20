import { getChallengeLocale } from '../../../shared/infrastructure/utils/request-response-utils.js';
import { usecases as devcompUsecases } from '../../domain/usecases/index.js';
import * as trainingSerializer from '../../infrastructure/serializers/jsonapi/training-serializer.js';

const findTrainings = async function (request, h, dependencies = { trainingSerializer }) {
  const { userId } = request.auth.credentials;
  const { id: campaignParticipationId } = request.params;
  const locale = getChallengeLocale(request);

  const trainings = await devcompUsecases.findCampaignParticipationTrainings({
    userId,
    campaignParticipationId,
    locale,
  });
  return dependencies.trainingSerializer.serialize(trainings);
};

const campaignParticipationController = {
  findTrainings,
};

export { campaignParticipationController };
