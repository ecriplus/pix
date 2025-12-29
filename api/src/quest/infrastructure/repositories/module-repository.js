import { Module } from '../../domain/models/Module.js';

export const getByIds = async ({ moduleIds, modulesApi }) => {
  const modules = await modulesApi.getModulesByIds({ moduleIds });

  return modules.map((module) => new Module(module));
};

export const getByShortIds = async ({ moduleShortIds, modulesApi }) => {
  const modules = await modulesApi.getModulesByShortIds({ moduleShortIds });

  return modules.map((module) => new Module(module));
};
