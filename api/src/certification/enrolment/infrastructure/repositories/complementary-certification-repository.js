/**
 * @typedef {import ('./index.js').ComplementaryCertificationApi} ComplementaryCertificationApi
 */
import { knex } from '../../../../../db/knex-database-connection.js';
import { ComplementaryCertification } from '../../../shared/domain/models/ComplementaryCertification.js';

const findAll = async function () {
  const result = await knex.from('complementary-certifications').select('id', 'label', 'key').orderBy('id', 'asc');

  return result.map(_toDomain);
};

export { findAll };

function _toDomain(result) {
  return new ComplementaryCertification(result);
}
