import { injectDependencies } from '../../../../shared/infrastructure/utils/dependency-injection.js';
import * as learningContentRepository from './learning-content-repository.js';
import * as versionRepository from './version-repository.js';

/**
 * Using {@link https://jsdoc.app/tags-type "Closure Compiler's syntax"} to document injected dependencies
 *
 * @typedef {learningContentRepository} LearningContentRepository
 * @typedef {versionRepository} VersionRepository
 */
const repositoriesWithoutInjectedDependencies = {
  learningContentRepository,
  versionRepository,
};

const configurationRepositories = injectDependencies(repositoriesWithoutInjectedDependencies);

export { configurationRepositories };
