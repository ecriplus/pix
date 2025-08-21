import { getI18nFromRequest } from '../../../shared/infrastructure/i18n/i18n.js';
import { usecases } from '../domain/usecases/index.js';
import { getDivisionCertificationResultsCsv } from '../infrastructure/utils/csv/certification-results/get-division-certification-results-csv.js';

const downloadCertificationResults = async function (
  request,
  h,
  dependencies = { getDivisionCertificationResultsCsv },
) {
  const i18n = await getI18nFromRequest(request);

  const organizationId = request.params.organizationId;
  const { division } = request.query;

  const certificationResults = await usecases.getScoCertificationResultsByDivision({ organizationId, division });

  const csvResult = await dependencies.getDivisionCertificationResultsCsv({
    division,
    certificationResults,
    i18n,
  });

  return h
    .response(csvResult.content)
    .header('Content-Type', 'text/csv;charset=utf-8')
    .header('Content-Disposition', `attachment; filename="${csvResult.filename}"`);
};

const organizationController = {
  downloadCertificationResults,
};

export { organizationController };
