import { injectDependencies } from '../../../shared/infrastructure/utils/dependency-injection.js';
import * as informationBannerRepository from '../../infrastructure/repositories/information-banner-repository.js';

/**
 *
 * Using {@link https://jsdoc.app/tags-type "Closure Compiler's syntax"} to document injected dependencies
 *
 * @typedef {informationBannerRepository} InformationBannerRepository
 **/
const dependencies = {
  informationBannerRepository,
};

import { getInformationBanner } from './get-information-banner.js';

const usecasesWithoutInjectedDependencies = {
  getInformationBanner,
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

/**
 * @typedef {dependencies} dependencies
 */
export { usecases };
