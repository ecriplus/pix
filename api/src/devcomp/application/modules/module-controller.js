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

const getJsonSchema = async function (_request, h) {
  const { jsonSchema, jsonSchemaChecksum } = usecases.getModuleJsonSchema();

  return h
    .response(jsonSchema)
    .type('application/json')
    .charset('UTF-8')
    .header('Cache-Control', 'public, max-age=900')
    .etag(jsonSchemaChecksum);
};

const modulesController = { getByShortId, getBySlug, getJsonSchema };

export { modulesController };
