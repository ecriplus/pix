import * as scoOrganizationLearnerSerializer from '../../../src/prescription/learner-management/infrastructure/serializers/jsonapi/sco-organization-learner-serializer.js';
import { usecases } from '../../domain/usecases/index.js';

const generateUsername = async function (request, h, dependencies = { scoOrganizationLearnerSerializer }) {
  const payload = request.payload.data.attributes;
  const { 'organization-id': organizationId } = payload;

  const studentInformation = {
    firstName: payload['first-name'],
    lastName: payload['last-name'],
    birthdate: payload['birthdate'],
  };

  const username = await usecases.generateUsername({ organizationId, studentInformation });

  const scoOrganizationLearner = {
    ...studentInformation,
    username,
  };

  return h
    .response(dependencies.scoOrganizationLearnerSerializer.serializeWithUsernameGeneration(scoOrganizationLearner))
    .code(200);
};

const generateUsernameWithTemporaryPassword = async function (
  request,
  h,
  dependencies = { scoOrganizationLearnerSerializer },
) {
  const payload = request.payload.data.attributes;
  const organizationId = payload['organization-id'];
  const organizationLearnerId = payload['organization-learner-id'];

  const result = await usecases.generateUsernameWithTemporaryPassword({
    organizationLearnerId,
    organizationId,
  });

  return h.response(dependencies.scoOrganizationLearnerSerializer.serializeCredentialsForDependent(result)).code(200);
};

const libScoOrganizationLearnerController = {
  generateUsername,
  generateUsernameWithTemporaryPassword,
};

export { libScoOrganizationLearnerController };
