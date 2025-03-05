import crypto from 'node:crypto';

import { NotFoundError } from '../../../shared/domain/errors.js';
import { LearningContentResourceNotFound } from '../../../shared/domain/errors.js';
import { ModuleFactory } from '../factories/module-factory.js';

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
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(moduleData));
  return hash.copy().digest('hex');
}

export { getBySlug, list };
