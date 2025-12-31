// @ts-check
/**
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 */
import { knex } from '../../../../../db/knex-database-connection.js';
import { ComplementaryCertification } from '../../../shared/domain/models/ComplementaryCertification.js';

/**
 * @function
 * @returns {Promise<Array<ComplementaryCertification>>}
 */
const findAll = async function () {
  const result = await knex.from('complementary-certifications').select('id', 'label', 'key').orderBy('id', 'asc');

  return result.map(_toDomain);
};

export { findAll };

/**
 * @typedef {object} ComplementaryCertificationDTO
 * @property {number} id
 * @property {string} label
 * @property {ComplementaryCertificationKeys} key
 */

/**
 * @function
 * @param {ComplementaryCertificationDTO} result
 * @returns {ComplementaryCertification}
 */
function _toDomain(result) {
  return new ComplementaryCertification(result);
}
