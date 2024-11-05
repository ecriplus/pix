import { usecases } from '../domain/usecases/index.js';
import { extractExternalIds } from '../infrastructure/serializers/csv/sco-whitelist-csv-parser.js';

const importScoWhitelist = async function (request, h, dependencies = { extractExternalIds }) {
  const externalIds = await dependencies.extractExternalIds(request.payload.path);
  await usecases.importScoWhitelist({ externalIds });
  return h.response().created();
};

const exportScoWhitelist = async function (request, h) {
  return h
    .response()
    .header('Content-Type', 'text/csv; charset=utf-8')
    .header('content-disposition', 'filename=sco-whitelist')
    .code(200);
};

export const scoWhitelistController = {
  importScoWhitelist,
  exportScoWhitelist,
};
