import * as requestResponseUtils from '../../../src/shared/infrastructure/utils/request-response-utils.js';
import { usecases } from '../domain/usecases/index.js';
import * as profileSerializer from '../infrastructure/serializers/jsonapi/profile-serializer.js';

const getProfile = function (request, h, dependencies = { profileSerializer, requestResponseUtils }) {
  const authenticatedUserId = request.auth.credentials.userId;
  const locale = dependencies.requestResponseUtils.extractLocaleFromRequest(request);

  return usecases
    .getUserProfile({ userId: authenticatedUserId, locale })
    .then(dependencies.profileSerializer.serialize);
};

const getProfileForAdmin = function (request, h, dependencies = { profileSerializer, requestResponseUtils }) {
  const userId = request.params.id;
  const locale = dependencies.requestResponseUtils.extractLocaleFromRequest(request);

  return usecases.getUserProfile({ userId, locale }).then(dependencies.profileSerializer.serialize);
};

const shareProfileReward = async function (request, h) {
  const userId = request.params.userId;
  const { profileRewardId, campaignParticipationId } = request.payload.data.attributes;

  await usecases.shareProfileReward({ userId, profileRewardId, campaignParticipationId });
  return h.response().code(201);
};

const profileController = {
  getProfile,
  getProfileForAdmin,
  shareProfileReward,
};

export { profileController };
