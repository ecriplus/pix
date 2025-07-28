import { Module } from '../../domain/models/Module.js';

export const getByUserIdAndModuleIds = async ({ userId, moduleIds, modulesApi }) => {
  const modules = await modulesApi.getUserModuleStatuses({ userId, moduleIds });

  return modules.map((module) => new Module(module));
};
