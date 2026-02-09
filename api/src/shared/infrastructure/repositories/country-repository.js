import { DomainTransaction } from '../../domain/DomainTransaction.js';
import { NotFoundError } from '../../domain/errors.js';
import { Country } from '../../domain/read-models/Country.js';

const findAll = async function () {
  const knexConn = DomainTransaction.getConnection();
  const result = await knexConn
    .from('certification-cpf-countries')
    .select('commonName', 'code', 'matcher')
    .where('commonName', '=', knexConn.ref('originalName'))
    .orderBy('commonName', 'asc');

  return result.map(_toDomain);
};

const getByCode = async function (code) {
  const knexConn = DomainTransaction.getConnection();
  const result = await knexConn
    .from('certification-cpf-countries')
    .select('commonName', 'code', 'matcher')
    .where({ code })
    .where('commonName', '=', knexConn.ref('originalName'))
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
