import { knex } from '../../../../db/knex-database-connection.js';
import { NotFoundError } from '../../domain/errors.js';
import { Country } from '../../domain/read-models/Country.js';

const findAll = async function () {
  const result = await knex
    .from('certification-cpf-countries')
    .select('commonName', 'code', 'matcher')
    .where('commonName', '=', knex.ref('originalName'))
    .orderBy('commonName', 'asc');

  return result.map(_toDomain);
};

const getByCode = async function (code) {
  const result = await knex
    .from('certification-cpf-countries')
    .select('commonName', 'code', 'matcher')
    .where({ code })
    .where('commonName', '=', knex.ref('originalName'))
    .first();

  if (!result) {
    throw new NotFoundError();
  }

  return _toDomain(result);
};

export { findAll, getByCode };

function _toDomain(row) {
  return new Country({
    ...row,
    name: row.commonName,
  });
}
