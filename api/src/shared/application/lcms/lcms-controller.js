import { sharedUsecases as usecases } from '../../domain/usecases/index.js';
import { logger } from '../../infrastructure/utils/logger.js';

const createRelease = async function (request, h) {
  usecases
    .createLcmsRelease()
    .then(() => {
      logger.info('Release created and cache reloaded');
    })
    .catch((e) => {
      logger.error('Error while creating the release and reloading cache', e);
    });
  return h.response({}).code(204);
};

const refreshCache = async function (request, h) {
  const { userId } = request.auth.credentials;

  await usecases.scheduleRefreshLearningContentCacheJob({ userId });
  return h.response({}).code(202);
};

const patchCacheEntry = async function (request, h) {
  const updatedRecord = request.payload;
  const recordId = request.params.id;
  const modelName = request.params.model;
  await usecases.patchLearningContentCacheEntry({ recordId, updatedRecord, modelName });
  return h.response().code(204);
};

const lcmsController = { createRelease, refreshCache, patchCacheEntry };

export { lcmsController };
