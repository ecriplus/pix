import { injectDependencies } from '../../../../shared/infrastructure/utils/dependency-injection.js';
import * as sessionsRepository from './sessions-repository.js';

/**
 * @typedef {sessionsRepository} SessionsRepository
 **/
const repositoriesWithoutInjectedDependencies = {
  sessionsRepository,
};

const dependencies = {};
const configurationRepositories = injectDependencies(repositoriesWithoutInjectedDependencies, dependencies);

export { configurationRepositories };
