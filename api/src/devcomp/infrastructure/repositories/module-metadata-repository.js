import { NotFoundError } from '../../../shared/domain/errors.js';
import { ModuleMetadata } from '../../domain/models/module/ModuleMetadata.js';

export async function getAllByIds({ ids, moduleDatasource }) {
  try {
    const modules = await moduleDatasource.getAllByIds(ids);
    return modules.map(_toDomain);
  } catch (error) {
    throw new NotFoundError(error.message);
  }
}

function _toDomain(module) {
  const { id, shortId, slug, title, isBeta, details } = module;
  return new ModuleMetadata({ id, shortId, slug, title, isBeta, duration: details.duration, image: details.image });
}
