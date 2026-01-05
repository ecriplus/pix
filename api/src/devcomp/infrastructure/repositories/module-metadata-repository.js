import { NotFoundError } from '../../../shared/domain/errors.js';
import { ModuleMetadata } from '../../domain/models/module/ModuleMetadata.js';

async function getAllByIds({ ids, moduleDatasource }) {
  try {
    const modules = await moduleDatasource.getAllByIds(ids);
    return modules.map(_toDomain);
  } catch (error) {
    throw new NotFoundError(error.message);
  }
}

async function getByShortId({ shortId, moduleDatasource }) {
  try {
    const module = await moduleDatasource.getByShortId(shortId);
    return _toDomain(module);
  } catch (error) {
    throw new NotFoundError(error.message);
  }
}

async function getBySlug({ slug, moduleDatasource }) {
  try {
    const module = await moduleDatasource.getBySlug(slug);
    return _toDomain(module);
  } catch (error) {
    throw new NotFoundError(error.message);
  }
}

function _toDomain(module) {
  const { id, shortId, slug, title, isBeta, details } = module;
  return new ModuleMetadata({ id, shortId, slug, title, isBeta, duration: details.duration, image: details.image });
}

export { getAllByIds, getByShortId, getBySlug };
