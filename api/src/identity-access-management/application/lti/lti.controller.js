import { usecases } from '../../domain/usecases/index.js';

async function listPublicKeys(request, h, dependencies = { listLtiPublicKeys: usecases.listLtiPublicKeys }) {
  const publicKeys = await dependencies.listLtiPublicKeys();
  return h.response(publicKeys).code(200);
}

export const ltiController = { listPublicKeys };
