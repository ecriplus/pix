const getBySlug = async function (request, h, { moduleSerializer, usecases }) {
  const { slug } = request.params;
  const encryptedRedirectionUrl = request.query.encryptedRedirectionUrl;
  const module = await usecases.getModule({ slug, encryptedRedirectionUrl });

  return moduleSerializer.serialize(module);
};

const modulesController = { getBySlug };

export { modulesController };
