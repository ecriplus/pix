import { usecases } from '../../domain/usecases/index.js';
import { OrganizationDTO } from './OrganizationDTO.js';
/**
 * @module OrganizationApi
 */

/**
 * @typedef OrganizationDTO
 * @type {object}
 * @property {number} id
 * @property {string} name
 * @property {string} type
 * @property {string} logoUrl
 * @property {boolean} isManagingStudents
 * @property {string} identityProvider
 */

/**
 * @typedef NotFoundError
 * @type {object}
 * @property {string} message
 * @property {string} code
 */

/**
 * @function
 * @name getOrganization
 *
 * @param {number} id
 * @returns {Promise<OrganizationDTO>}
 * @throws {NotFoundError} if organization does not exist
 */
export const getOrganization = async (id) => {
  return new OrganizationDTO(await usecases.getOrganizationById({ id }));
};
