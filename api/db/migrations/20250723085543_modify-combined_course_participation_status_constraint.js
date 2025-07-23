const TABLE_NAME = 'combined_course_participations';
const FORMER_TABLE_NAME = 'quest_participations';
const COLUMN_NAME = 'status';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const formatAlterTableEnumSql = (tableName, columnName, enums, caseFunction) => {
  const constraintName = `${tableName}_${columnName}_check`;
  return [
    `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${constraintName};`,
    `UPDATE ${tableName} SET ${COLUMN_NAME}=${caseFunction}(${COLUMN_NAME});`,
    `ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} CHECK (${columnName} = ANY (ARRAY['${enums.join(
      "'::text, '",
    )}'::text]));`,
  ].join('\n');
};

const up = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.dropChecks([`${FORMER_TABLE_NAME}_${COLUMN_NAME}_check`]);
    table.text(COLUMN_NAME).defaultTo('STARTED').alter();
    table.integer('organizationLearnerId').notNullable().alter();
    table.integer('questId').notNullable().alter();
  });
  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(formatAlterTableEnumSql(TABLE_NAME, COLUMN_NAME, ['STARTED', 'COMPLETED'], 'UPPER'));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(formatAlterTableEnumSql(TABLE_NAME, COLUMN_NAME, ['started', 'completed'], 'LOWER'));
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.text(COLUMN_NAME).defaultTo('started').alter();
    table.integer('organizationLearnerId').nullable().alter();
    table.integer('questId').nullable().alter();
  });
};

export { down, up };
