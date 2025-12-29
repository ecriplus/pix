import { DomainError } from '../../../shared/domain/errors.js';
import { usecases } from '../../domain/usecases/index.js';
import { Module } from './models/Module.js';
import { ModuleStatus } from './models/ModuleStatus.js';

/**
 * @param {object} params
 * @param {string[]} params.moduleIds
 *
 * @returns {Module[]}
 */
const getModulesByIds = async ({ moduleIds }) => {
  if (!moduleIds || !Array.isArray(moduleIds) || moduleIds.length === 0) {
    return [];
  }

  const modules = await usecases.getModuleMetadataList({ ids: moduleIds });
  return modules.map((module) => new Module(module));
};

/**
 * @function
 * @name getUserModuleStatuses
 *
 * @param {object} params
 * @param {number} params.userId mandatory target user id
 * @param {number[]} params.moduleIds mandatory
 *
 * @typedef ModuleStatus
 * @property {number} id
 * @property {string} title
 * @property {string} slug
 * @property {number} duration
 * @property {string} status ('not_started' | 'in_progress' | 'completed')
 * @property {string} shortId
 *
 * @returns {ModuleStatus[]}
 * @throws {BadRequestError} UserId field is missing
 */
const getUserModuleStatuses = async ({ userId, moduleIds }) => {
  if (!userId) {
    throw new DomainError('The userId is required');
  }

  if (!moduleIds || !(moduleIds.length > 0)) {
    return [];
  }

  const moduleMetadataList = await usecases.getModuleMetadataList({ ids: moduleIds });
  const userModuleStatus = await usecases.getUserModuleStatuses({ userId, moduleIds });

  const moduleMetadataId = new Map();
  moduleMetadataList.forEach((moduleMetadata) => {
    moduleMetadataId.set(moduleMetadata.id, moduleMetadata);
  });

  return userModuleStatus.map((userModuleStatus) => {
    const { id, slug, title, duration, image, shortId } = moduleMetadataId.get(userModuleStatus.moduleId);

    return new ModuleStatus({
      id,
      slug,
      title,
      status: userModuleStatus.status,
      createdAt: userModuleStatus.createdAt,
      updatedAt: userModuleStatus.updatedAt,
      terminatedAt: userModuleStatus.terminatedAt,
      duration,
      image,
      shortId,
    });
  });
};

const getModulesByShortIds = async ({ moduleShortIds }) => {
  const modules = [];
  for (const shortId of moduleShortIds) {
    modules.push(await usecases.getModuleByShortId({ shortId }));
  }
  return modules.map((module) => new Module(module));
};
export { getModulesByIds, getModulesByShortIds, getUserModuleStatuses };
