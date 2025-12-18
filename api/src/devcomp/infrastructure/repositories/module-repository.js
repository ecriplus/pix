import crypto from 'node:crypto';

import { NotFoundError } from '../../../shared/domain/errors.js';
import { LearningContentResourceNotFound } from '../../../shared/domain/errors.js';
import { ModuleDoesNotExistError } from '../../domain/errors.js';
import { ModuleFactory } from '../factories/module-factory.js';

async function getById({ id, moduleDatasource }) {
  return await _getModule({ ref: 'id', moduleDatasource, query: id });
}

async function getByShortId({ shortId, moduleDatasource }) {
  return await _getModule({ ref: 'shortId', moduleDatasource, query: shortId });
}

async function getBySlug({ slug, moduleDatasource }) {
  return await _getModule({ ref: 'slug', moduleDatasource, query: slug });
}

async function list({ moduleDatasource }) {
  const modulesData = await moduleDatasource.list();
  return Promise.all(modulesData.map(async (moduleData) => await ModuleFactory.build(moduleData)));
}

export { getById, getByShortId, getBySlug, list };

function _computeModuleVersion(moduleData) {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(moduleData));
  return hash.copy().digest('hex');
}

async function _getModule({ ref, moduleDatasource, query }) {
  try {
    const method = getModuleMethod(ref, moduleDatasource);
    const moduleData = await method(query);
    const version = _computeModuleVersion(moduleData);

    return await ModuleFactory.build({ ...moduleData, version });
  } catch (error) {
    if (error instanceof LearningContentResourceNotFound || error instanceof ModuleDoesNotExistError) {
      throw new NotFoundError();
    }
    throw error;
  }
}

function getModuleMethod(ref, moduleDatasource) {
  switch (ref) {
    case 'slug':
      return moduleDatasource.getBySlug;
    case 'shortId':
      return moduleDatasource.getByShortId;
    case 'id':
      return moduleDatasource.getById;
    default:
      return moduleDatasource.getById;
  }
}
