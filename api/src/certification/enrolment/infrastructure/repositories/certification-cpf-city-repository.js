// @ts-check
import { knex } from '../../../../../db/knex-database-connection.js';
import { CertificationCpfCity } from '../../../shared/domain/models/CertificationCpfCity.js';

const COLUMNS = ['id', 'name', 'postalCode', 'INSEECode', 'isActualName'];

/**
 * @function
 * @param {object} params
 * @param {number} params.INSEECode
 * @returns {Promise<Array<CertificationCpfCity>> }
 */
const findByINSEECode = async function ({ INSEECode }) {
  const result = await knex
    .select(COLUMNS)
    .from('certification-cpf-cities')
    .where({ INSEECode })
    .orderBy('isActualName', 'desc')
    .orderBy('id');

  return result.map((city) => new CertificationCpfCity(city));
};

/**
 * @function
 * @param {object} params
 * @param {number} params.postalCode
 * @returns {Promise<Array<CertificationCpfCity>> }
 */
const findByPostalCode = async function ({ postalCode }) {
  const result = await knex
    .select(COLUMNS)
    .from('certification-cpf-cities')
    .where({ postalCode })
    .orderBy('isActualName', 'desc')
    .orderBy('id');

  return result.map((city) => new CertificationCpfCity(city));
};

export { findByINSEECode, findByPostalCode };
