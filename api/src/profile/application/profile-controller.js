import { getChallengeLocale } from '../../shared/infrastructure/utils/request-response-utils.js';
import { usecases } from '../domain/usecases/index.js';
import * as profileSerializer from '../infrastructure/serializers/jsonapi/profile-serializer.js';

const getProfile = async function (request, h, dependencies = { profileSerializer }) {
  const authenticatedUserId = request.auth.credentials.userId;
  const locale = await getChallengeLocale(request);

  return usecases
    .getUserProfile({ userId: authenticatedUserId, locale })
    .then(dependencies.profileSerializer.serialize);
};

const getProfileForAdmin = async function (request, h, dependencies = { profileSerializer }) {
  const userId = request.params.id;
  const locale = await getChallengeLocale(request);

  return usecases.getUserProfile({ userId, locale }).then(dependencies.profileSerializer.serialize);
};

const profileController = {
  getProfile,
  getProfileForAdmin,
};

export { profileController };
