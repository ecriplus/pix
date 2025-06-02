import dayjs from 'dayjs';

import * as scoOrganizationLearnerSerializer from '../../../src/prescription/learner-management/infrastructure/serializers/jsonapi/sco-organization-learner-serializer.js';
import { DomainTransaction } from '../../../src/shared/domain/DomainTransaction.js';
import { usecases } from '../../domain/usecases/index.js';

const generateUsername = async function (request, h, dependencies = { scoOrganizationLearnerSerializer }) {
  const payload = request.payload.data.attributes;
  const { 'campaign-code': campaignCode } = payload;

  const studentInformation = {
    firstName: payload['first-name'],
    lastName: payload['last-name'],
    birthdate: payload['birthdate'],
  };

  const username = await usecases.generateUsername({ campaignCode, studentInformation });

  const scoOrganizationLearner = {
    ...studentInformation,
    username,
    campaignCode,
  };

  return h
    .response(dependencies.scoOrganizationLearnerSerializer.serializeWithUsernameGeneration(scoOrganizationLearner))
    .code(200);
};

const updatePassword = async function (request, h, dependencies = { scoOrganizationLearnerSerializer }) {
  const payload = request.payload.data.attributes;
  const userId = request.auth.credentials.userId;
  const organizationId = payload['organization-id'];
  const organizationLearnerId = payload['organization-learner-id'];

  const scoOrganizationLearner = await usecases.updateOrganizationLearnerDependentUserPassword({
    userId,
    organizationId,
    organizationLearnerId,
  });

  return h
    .response(dependencies.scoOrganizationLearnerSerializer.serializeCredentialsForDependent(scoOrganizationLearner))
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

const batchGenerateOrganizationLearnersUsernameWithTemporaryPassword = async function (request, h) {
  const payload = request.payload.data.attributes;
  const userId = request.auth.credentials.userId;
  const organizationId = payload['organization-id'];
  const organizationLearnersId = payload['organization-learners-id'];

  const generatedCsvContent = await DomainTransaction.execute(async () => {
    const organizationLearnersPasswordResets = await usecases.generateOrganizationLearnersUsernameAndTemporaryPassword({
      userId,
      organizationId,
      organizationLearnersId,
    });
    return usecases.generateResetOrganizationLearnersPasswordCsvContent({
      organizationLearnersPasswordResets,
    });
  });

  const dateWithTime = dayjs().locale('fr').format('YYYYMMDD_HHmm');
  const generatedCsvContentFileName = `${dateWithTime}_organization_learners_password_reset.csv`;

  return h
    .response(generatedCsvContent)
    .header('Content-Type', 'text/csv;charset=utf-8')
    .header('Content-Disposition', `attachment; filename=${generatedCsvContentFileName}`);
};

const libScoOrganizationLearnerController = {
  generateUsername,
  updatePassword,
  generateUsernameWithTemporaryPassword,
  batchGenerateOrganizationLearnersUsernameWithTemporaryPassword,
};

export { libScoOrganizationLearnerController };
