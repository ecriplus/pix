import { usecases } from '../../domain/usecases/index.js';
import { OrganizationFeatureItemDTO } from './OrganizationFeatureItemDTO.js';
import { OrganizationFeaturesDTO } from './OrganizationFeaturesDTO.js';

/**
 * @module OrganizationFeaturesApi
 */

/**
 * @typedef OrganizationFeatureItemDTO
 * @type {object}
 * @property {string} name
 * @property {object | Array<string>}params
 */

/**
 * @typedef OrganizationFeaturesDTO
 * @type {object}
 * @property {Array<OrganizationFeatureItemDTO>} features
 * @property {boolean} hasLearnersImportFeature
 * @property {boolean} hasOralizationFeature
 */

/**
 * @function
 * @name getAllFeaturesFromOrganization
 *
 * @param {number} organizationId
 * @returns {Promise<OrganizationFeaturesDTO>}
 */
export const getAllFeaturesFromOrganization = async (organizationId) => {
  const organizationFeatures = await usecases.findOrganizationFeatures({ organizationId });

  return new OrganizationFeaturesDTO({
    features: organizationFeatures.map((organizationFeature) => new OrganizationFeatureItemDTO(organizationFeature)),
  });
};
