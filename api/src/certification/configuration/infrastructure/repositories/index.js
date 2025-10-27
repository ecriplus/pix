import { injectDependencies } from '../../../../shared/infrastructure/utils/dependency-injection.js';
import * as learningContentRepository from './learning-content-repository.js';
import * as versionsRepository from './versions-repository.js';

/**
 * Using {@link https://jsdoc.app/tags-type "Closure Compiler's syntax"} to document injected dependencies
 *
 * @typedef {learningContentRepository} LearningContentRepository
 * @typedef {versionsRepository} VersionsRepository
 */
const repositoriesWithoutInjectedDependencies = {
  learningContentRepository,
  versionsRepository,
};

const configurationRepositories = injectDependencies(repositoriesWithoutInjectedDependencies);

export { configurationRepositories };
