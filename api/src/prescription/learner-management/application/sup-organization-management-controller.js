import fs from 'fs';

import { logErrorWithCorrelationIds } from '../../../../lib/infrastructure/monitoring-tools.js';
import { tokenService } from '../../../shared/domain/services/token-service.js';
import { usecases } from '../domain/usecases/index.js';
import * as supOrganizationLearnerWarningSerializer from '../infrastructure/serializers/jsonapi/sup-organization-learner-warnings-serializer.js';

const importSupOrganizationLearners = async function (
  request,
  h,
  dependencies = {
    supOrganizationLearnerWarningSerializer,
    logErrorWithCorrelationIds,
    unlink: fs.unlink,
  },
) {
  const organizationId = request.params.id;
  const authenticatedUserId = request.auth.credentials.userId;
  let warnings;

  try {
    warnings = await usecases.importSupOrganizationLearners({
      payload: request.payload,
      organizationId,
      i18n: request.i18n,
      userId: authenticatedUserId,
    });
  } finally {
    try {
      dependencies.unlink(request.payload.path);
    } catch (err) {
      dependencies.logErrorWithCorrelationIds(err);
    }
  }

  return h
    .response(dependencies.supOrganizationLearnerWarningSerializer.serialize({ id: organizationId, warnings }))
    .code(200);
};

const replaceSupOrganizationLearners = async function (
  request,
  h,
  dependencies = {
    supOrganizationLearnerWarningSerializer,
    logErrorWithCorrelationIds,
    unlink: fs.unlink,
  },
) {
  const userId = request.auth.credentials.userId;
  const organizationId = request.params.id;

  let warnings;
  try {
    warnings = await usecases.replaceSupOrganizationLearners({
      payload: request.payload,
      i18n: request.i18n,
      organizationId,
      userId,
    });
  } finally {
    // see https://hapi.dev/api/?v=21.3.3#-routeoptionspayloadoutput
    // add a catch to avoid an error if unlink fails
    try {
      dependencies.unlink(request.payload.path);
    } catch (err) {
      dependencies.logErrorWithCorrelationIds(err);
    }
  }

  return h
    .response(dependencies.supOrganizationLearnerWarningSerializer.serialize({ id: organizationId, warnings }))
    .code(200);
};

const getOrganizationLearnersCsvTemplate = async function (request, h, dependencies = { tokenService }) {
  const organizationId = request.params.id;
  const token = request.query.accessToken;
  const userId = dependencies.tokenService.extractUserId(token);
  const template = await usecases.getOrganizationLearnersCsvTemplate({
    userId,
    organizationId,
    i18n: request.i18n,
  });

  return h
    .response(template)
    .header('Content-Type', 'text/csv;charset=utf-8')
    .header('Content-Disposition', `attachment; filename=${request.i18n.__('csv-template.template-name')}.csv`);
};

const updateStudentNumber = async function (request, h) {
  const payload = request.payload.data.attributes;
  const organizationId = request.params.id;
  const studentNumber = payload['student-number'];
  const organizationLearnerId = request.params.organizationLearnerId;

  await usecases.updateStudentNumber({ organizationLearnerId, studentNumber, organizationId });

  return h.response().code(204);
};

const supOrganizationManagementController = {
  getOrganizationLearnersCsvTemplate,
  importSupOrganizationLearners,
  replaceSupOrganizationLearners,
  updateStudentNumber,
};

export { supOrganizationManagementController };
