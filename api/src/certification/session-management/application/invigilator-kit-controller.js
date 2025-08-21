import { getI18nFromRequest } from '../../../shared/infrastructure/i18n/i18n.js';
import { usecases } from '../domain/usecases/index.js';
import * as invigilatorKitPdf from '../infrastructure/utils/pdf/invigilator-kit-pdf.js';

const getInvigilatorKitPdf = async function (request, h, dependencies = { invigilatorKitPdf }) {
  const sessionId = request.params.sessionId;
  const { userId } = request.auth.credentials;

  const i18n = await getI18nFromRequest(request);

  const sessionForInvigilatorKit = await usecases.getInvigilatorKitSessionInfo({ sessionId, userId });

  const { buffer, fileName } = await dependencies.invigilatorKitPdf.getInvigilatorKitPdfBuffer({
    sessionForInvigilatorKit,
    lang: i18n.getLocale(),
  });

  return h
    .response(buffer)
    .header('Content-Disposition', `attachment; filename=${fileName}`)
    .header('Content-Type', 'application/pdf');
};

const invigilatorKitController = {
  getInvigilatorKitPdf,
};
export { invigilatorKitController };
