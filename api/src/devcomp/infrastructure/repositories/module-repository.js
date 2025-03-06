import crypto from 'node:crypto';

import { NotFoundError } from '../../../shared/domain/errors.js';
import { LearningContentResourceNotFound } from '../../../shared/domain/errors.js';
import { ModuleFactory } from '../factories/module-factory.js';

const memoizedModuleVersions = new Map();

async function getBySlug({ slug, moduleDatasource }) {
  try {
    const moduleData = await moduleDatasource.getBySlug(slug);
    const version = _computeModuleVersion(moduleData);

    return ModuleFactory.build({ ...moduleData, version });
  } catch (e) {
    if (e instanceof LearningContentResourceNotFound) {
      throw new NotFoundError();
    }
    throw e;
  }
}

async function list({ moduleDatasource }) {
  const modulesData = await moduleDatasource.list();
  return modulesData.map((moduleData) => ModuleFactory.build(moduleData));
}

function _computeModuleVersion(moduleData) {
  if (!memoizedModuleVersions.has(moduleData.slug)) {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(moduleData));
    const version = hash.copy().digest('hex');
    memoizedModuleVersions.set(moduleData.slug, version);
  }
  return memoizedModuleVersions.get(moduleData.slug);
}

export { getBySlug, list };
