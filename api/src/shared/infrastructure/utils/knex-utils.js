import { knex } from '../../../../db/knex-database-connection.js';

const DEFAULT_PAGINATION = {
  PAGE: 1,
  PAGE_SIZE: 10,
};

/**
 * Paginate a knex query with given page parameters
 * @param {*} queryBuilder - a knex query builder
 * @param {Object} page - page parameters
 * @param {Number} page.number - the page number to retrieve
 * @param {Number} page.size - the size of the page
 * @param {object|null|undefined} queryBuilder - a knex query builder that counts the total number of rows, when one do not want to use the default one
 * @param {object|null|undefined} trx - transaction to use, possibly null
 */
const fetchPage = async (
  queryBuilder,
  { number = DEFAULT_PAGINATION.PAGE, size = DEFAULT_PAGINATION.PAGE_SIZE } = {},
  trx,
  countRequestBuilder = undefined,
) => {
  const page = number < 1 ? 1 : number;
  const offset = (page - 1) * size;

  const countExecutor = countRequestBuilder
    ? countRequestBuilder
    : trx
      ? trx.count('*', { as: 'rowCount' }).from(queryBuilder.clone().as('query_all_results'))
      : knex.count('*', { as: 'rowCount' }).from(queryBuilder.clone().as('query_all_results'));

  // we cannot execute the query and count the total rows at the same time
  // because it would not work when there are DISTINCT selection in the SELECT clause
  const { rowCount } = await countExecutor.first();
  let results;
  if (trx) {
    results = await queryBuilder.limit(size).offset(offset).transacting(trx);
  } else {
    results = await queryBuilder.limit(size).offset(offset);
  }

  return {
    results,
    pagination: {
      page,
      pageSize: size,
      rowCount,
      pageCount: Math.ceil(rowCount / size),
    },
  };
};

function isUniqConstraintViolated(err) {
  const PGSQL_UNIQ_CONSTRAINT = '23505';

  return err.code === PGSQL_UNIQ_CONSTRAINT;
}

function foreignKeyConstraintViolated(err) {
  const PGSQL_FK_CONSTRAINT = '23503';

  return err.code === PGSQL_FK_CONSTRAINT;
}

function getChunkSizeForParameterBinding(objectAboutToBeBinded) {
  // PostgreSQL allows a maximum of 65536 binded parameters in prepared statements
  const MAX_BINDED_PARAMS_PG = 65536;
  if (objectAboutToBeBinded) {
    return Math.floor(MAX_BINDED_PARAMS_PG / Object.keys(objectAboutToBeBinded).length);
  }
  return MAX_BINDED_PARAMS_PG;
}

export {
  DEFAULT_PAGINATION,
  fetchPage,
  foreignKeyConstraintViolated,
  getChunkSizeForParameterBinding,
  isUniqConstraintViolated,
};
