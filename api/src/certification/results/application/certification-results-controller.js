import dayjs from 'dayjs';

import { tokenService } from '../../../shared/domain/services/token-service.js';
import { usecases } from '../domain/usecases/index.js';
import * as certifiedProfileRepository from '../infrastructure/repositories/certified-profile-repository.js';
import * as certifiedProfileSerializer from '../infrastructure/serializers/certified-profile-serializer.js';
import { getCleaCertifiedCandidateCsv } from '../infrastructure/utils/csv/certification-results/get-clea-certified-candidate-csv.js';
import { getSessionCertificationResultsCsv } from '../infrastructure/utils/csv/certification-results/get-session-certification-results-csv.js';

const getCleaCertifiedCandidateDataCsv = async function (request, h, dependencies = { getCleaCertifiedCandidateCsv }) {
  const sessionId = request.params.sessionId;
  const { session, cleaCertifiedCandidateData } = await usecases.getCleaCertifiedCandidateBySession({ sessionId });
  const csvResult = await dependencies.getCleaCertifiedCandidateCsv({
    cleaCertifiedCandidates: cleaCertifiedCandidateData,
  });

  const dateWithTime = dayjs(session.date + ' ' + session.time)
    .locale('fr')
    .format('YYYYMMDD_HHmm');
  const fileName = `${dateWithTime}_candidats_certifies_clea_${sessionId}.csv`;

  return h
    .response(csvResult)
    .header('Content-Type', 'text/csv;charset=utf-8')
    .header('Content-Disposition', `attachment; filename=${fileName}`);
};

const getSessionResultsByRecipientEmail = async function (
  request,
  h,
  dependencies = { tokenService, getSessionCertificationResultsCsv },
) {
  const token = request.params.token;

  const { resultRecipientEmail, sessionId } =
    dependencies.tokenService.extractCertificationResultsByRecipientEmailLink(token);
  const { session, certificationResults } = await usecases.getSessionResultsByResultRecipientEmail({
    sessionId,
    resultRecipientEmail,
  });
  const csvResult = await dependencies.getSessionCertificationResultsCsv({
    session,
    certificationResults,
    i18n: request.i18n,
  });

  return h
    .response(csvResult.content)
    .header('Content-Type', 'text/csv;charset=utf-8')
    .header('Content-Disposition', `attachment; filename=${csvResult.filename}`);
};

const getSessionResultsToDownload = async function (
  request,
  h,
  dependencies = { tokenService, getSessionCertificationResultsCsv },
) {
  const token = request.params.token;
  const { sessionId } = dependencies.tokenService.extractCertificationResultsLink(token);
  const { session, certificationResults } = await usecases.getSessionResults({ sessionId });

  const csvResult = await dependencies.getSessionCertificationResultsCsv({
    session,
    certificationResults,
    i18n: request.i18n,
  });

  return h
    .response(csvResult.content)
    .header('Content-Type', 'text/csv;charset=utf-8')
    .header('Content-Disposition', `attachment; filename=${csvResult.filename}`);
};

const postSessionResultsToDownload = async function (
  request,
  h,
  dependencies = { tokenService, getSessionCertificationResultsCsv },
) {
  const { sessionId } = dependencies.tokenService.extractCertificationResultsLink(request.payload.token);
  const { session, certificationResults } = await usecases.getSessionResults({ sessionId });

  const csvResult = await dependencies.getSessionCertificationResultsCsv({
    session,
    certificationResults,
    i18n: request.i18n,
  });

  return h
    .response(csvResult.content)
    .header('Content-Type', 'text/csv;charset=utf-8')
    .header('Content-Disposition', `attachment; filename=${csvResult.filename}`);
};

const getCertifiedProfile = async function (
  request,
  h,
  dependencies = { certifiedProfileRepository, certifiedProfileSerializer },
) {
  const certificationCourseId = request.params.id;
  //TODO add passthrough usecase to remove link between application and infrastructure
  const certifiedProfile = await dependencies.certifiedProfileRepository.get(certificationCourseId);
  return dependencies.certifiedProfileSerializer.serialize(certifiedProfile);
};

const certificationResultsController = {
  getCleaCertifiedCandidateDataCsv,
  getSessionResultsByRecipientEmail,
  getSessionResultsToDownload,
  postSessionResultsToDownload,
  getCertifiedProfile,
};

export { certificationResultsController };
