import * as certificationIssueReportSerializer from '../../../../lib/infrastructure/serializers/jsonapi/certification-issue-report-serializer.js';
import { usecases } from '../domain/usecases/index.js';

const saveCertificationIssueReport = async function (request, h) {
  const certificationIssueReportDTO = certificationIssueReportSerializer.deserialize(request);
  const certificationIssueReportSaved = await usecases.saveCertificationIssueReport({ certificationIssueReportDTO });

  return h.response(certificationIssueReportSerializer.serialize(certificationIssueReportSaved)).created();
};

const abort = async function (request, h) {
  const certificationCourseId = request.params.id;
  const abortReason = request.payload.data.reason;
  await usecases.abortCertificationCourse({ certificationCourseId, abortReason });
  return h.response().code(200);
};

const certificationReportController = { saveCertificationIssueReport, abort };

export { certificationReportController };
