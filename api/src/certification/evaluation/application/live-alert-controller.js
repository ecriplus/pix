import { usecases } from '../domain/usecases/index.js';

async function create(request, h) {
  const assessmentId = request.params.id;
  const challengeId = request.payload?.data?.attributes?.['challenge-id'];
  await usecases.createLiveAlert({ assessmentId, challengeId });
  return h.response().code(204);
}

const liveAlertController = {
  create,
};

export { liveAlertController };
