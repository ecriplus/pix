import {
  getForwardedOrigin,
  RequestedApplication,
} from '../../../identity-access-management/infrastructure/utils/network.js';
import { requestResponseUtils } from '../../../shared/infrastructure/utils/request-response-utils.js';
import * as scoOrganizationLearnerSerializer from '../../learner-management/infrastructure/serializers/jsonapi/sco-organization-learner-serializer.js';
import { usecases } from '../domain/usecases/index.js';

const createUserAndReconcileToOrganizationLearnerFromExternalUser = async function (
  request,
  h,
  dependencies = { scoOrganizationLearnerSerializer },
) {
  const { birthdate, 'campaign-code': campaignCode, 'external-user-token': token } = request.payload.data.attributes;

  const origin = getForwardedOrigin(request.headers);
  const requestedApplication = RequestedApplication.fromOrigin(origin);
  const accessToken = await usecases.createUserAndReconcileToOrganizationLearnerFromExternalUser({
    birthdate,
    campaignCode,
    token,
    audience: origin,
    requestedApplication,
  });

  const scoOrganizationLearner = {
    accessToken,
  };

  return h.response(dependencies.scoOrganizationLearnerSerializer.serializeExternal(scoOrganizationLearner)).code(200);
};
const createAndReconcileUserToOrganizationLearner = async function (
  request,
  h,
  dependencies = {
    scoOrganizationLearnerSerializer,
    requestResponseUtils,
  },
) {
  const payload = request.payload.data.attributes;
  const userAttributes = {
    firstName: payload['first-name'],
    lastName: payload['last-name'],
    birthdate: payload['birthdate'],
    email: payload.email,
    username: payload.username,
    withUsername: payload['with-username'],
  };
  const locale = dependencies.requestResponseUtils.extractLocaleFromRequest(request);

  await usecases.createAndReconcileUserToOrganizationLearner({
    userAttributes,
    password: payload.password,
    campaignCode: payload['campaign-code'],
    locale,
    i18n: request.i18n,
  });

  return h.response().code(204);
};
const scoOrganizationLearnerController = {
  createUserAndReconcileToOrganizationLearnerFromExternalUser,
  createAndReconcileUserToOrganizationLearner,
};

export { scoOrganizationLearnerController };
