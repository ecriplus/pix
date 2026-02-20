import { DomainTransaction } from '../../domain/DomainTransaction.js';

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  PAGE_SIZE: 10,
};

/**
 * Paginate a knex query with given page parameters
 * @param {object} params
 * @param {object} params.queryBuilder - a knex query builder
 * @param {object} params.paginationParams
 * @param {Number} params.paginationParams.number - the page number to retrieve
 * @param {Number} params.paginationParams.size - the size of the page
 * @param {object|null} params.countQueryBuilder - a knex query builder that counts the total number of rows, bypassing the default one
 */
export async function fetchPage({
  queryBuilder,
  paginationParams: { number = DEFAULT_PAGINATION.PAGE, size = DEFAULT_PAGINATION.PAGE_SIZE } = {},
  countQueryBuilder = null,
}) {
  const knexConn = DomainTransaction.getConnection();
  const page = number < 1 ? 1 : number;
  const offset = (page - 1) * size;

  const defaultCountQueryBuilder = knexConn
    .count('*', { as: 'row_count' })
    .from(queryBuilder.clone().as('query_all_results'));
  const finalCountQueryBuilder = countQueryBuilder || defaultCountQueryBuilder;

  // we cannot execute the query and count the total rows at the same time
  // because it would not work when there are DISTINCT selection in the SELECT clause
  let results, rowCount;
  if (knexConn.isTransaction) {
    results = await queryBuilder.limit(size).offset(offset).transacting(knexConn);
    const { row_count } = await finalCountQueryBuilder.transacting(knexConn).first();
    rowCount = row_count;
  } else {
    results = await queryBuilder.limit(size).offset(offset);
    const { row_count } = await finalCountQueryBuilder.first();
    rowCount = row_count;
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
}

export function isUniqConstraintViolated(err) {
  const PGSQL_UNIQ_CONSTRAINT = '23505';

  return err.code === PGSQL_UNIQ_CONSTRAINT;
}

export function foreignKeyConstraintViolated(err) {
  const PGSQL_FK_CONSTRAINT = '23503';

  return err.code === PGSQL_FK_CONSTRAINT;
}

/**
 * Optimized batch update for PG, which result in a query similar as :
 *
 * UPDATE "users" AS t
 * SET
 *   "firstName" = data."firstName",
 *   "lastName" = data."lastName"
 * FROM (
 *   VALUES
 *     ($1::integer, $2::character varying(255), $3::character varying(255)),
 *     ($4::integer, $5::character varying(255), $6::character varying(255)),
 *     ($7::integer, $8::character varying(255), $9::character varying(255))
 * ) AS data("id", "firstName", "lastName")
 * WHERE t."id" = data."id";
 *
 * @param {object} params
 * @param {string} params.tableName - example : 'users'
 * @param {string} params.schema - example : 'public'
 * @param {string} params.primaryKeyName - example : 'id'
 * @param {Array<object>} params.rows - ⚠️objects must have the same keys. example : [{ id: 1, firstName: 'Lolo', lastName: 'Lapraline' }, { id: 2, firstName: 'Roro', lastName: 'Lapistache' }]
 * @param {number} params.chunkSize - example : 500
 */
export async function batchUpdate({ schema = 'public', tableName, primaryKeyName, rows, chunkSize = 500 }) {
  if (!rows || rows.length === 0) return;

  const knexConn = DomainTransaction.getConnection();
  const columnTypes = await getColumnTypes(knexConn, tableName, schema);
  const columns = Object.keys(rows[0]);

  for (const chunk of chunks(rows, chunkSize)) {
    const values = [];
    const bindings = [];

    for (const row of chunk) {
      const rowPlaceholders = columns.map((col) => `?::${columnTypes[col]}`).join(', ');
      values.push(`(${rowPlaceholders})`);
      bindings.push(...columns.map((col) => row[col]));
    }

    const setClause = columns
      .filter((col) => col !== primaryKeyName)
      .map((col) => `"${col}" = data."${col}"`)
      .join(', ');

    const sql = `UPDATE "${schema}"."${tableName}" AS t
      SET ${setClause}
      FROM (
        VALUES ${values.join(', ')}
      ) AS data(${columns.map((c) => `"${c}"`).join(', ')})
      WHERE t."${primaryKeyName}" = data."${primaryKeyName}";
    `;

    // eslint-disable-next-line knex/avoid-injections
    await knexConn.raw(sql, bindings);
  }
}

function chunks(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

const tableColumnTypeCache = new Map();
async function getColumnTypes(knex, tableName, schema = 'public') {
  const cacheKey = `${schema}.${tableName}`;

  if (tableColumnTypeCache.has(cacheKey)) {
    return tableColumnTypeCache.get(cacheKey);
  }

  const result = await knex.raw(
    `
    SELECT
      a.attname AS column_name,
      format_type(a.atttypid, a.atttypmod) AS formatted_type
    FROM pg_attribute a
    JOIN pg_class c ON a.attrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE c.relname = ?
      AND n.nspname = ?
      AND a.attnum > 0
      AND NOT a.attisdropped
    `,
    [tableName, schema],
  );

  const columnTypes = {};

  for (const row of result.rows) {
    columnTypes[row.column_name] = row.formatted_type;
  }

  tableColumnTypeCache.set(cacheKey, columnTypes);

  return columnTypes;
}
