import { usecases } from '../../domain/usecases/index.js';

const getByShortId = async function (request, h, { moduleSerializer }) {
  const { shortId } = request.params;
  const encryptedRedirectionUrl = request.query.encryptedRedirectionUrl;
  const module = await usecases.getModuleByShortId({ shortId, encryptedRedirectionUrl });

  return moduleSerializer.serialize(module);
};

const getBySlug = async function (request, h, { moduleSerializer }) {
  const { slug } = request.params;
  const encryptedRedirectionUrl = request.query.encryptedRedirectionUrl;
  const module = await usecases.getModule({ slug, encryptedRedirectionUrl });

  return moduleSerializer.serialize(module);
};

const modulesController = { getByShortId, getBySlug };

export { modulesController };
