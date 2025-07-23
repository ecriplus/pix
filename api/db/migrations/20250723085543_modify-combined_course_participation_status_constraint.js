const TABLE_NAME = 'combined_course_participations';
const FORMER_TABLE_NAME = 'quest_participations';
const COLUMN_NAME = 'status';
const CONSTRAINT_NAME = `${TABLE_NAME}_${COLUMN_NAME}_check`;
const FORMER_CONSTRAINT_NAME = `${FORMER_TABLE_NAME}_${COLUMN_NAME}_check`;

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const formatAlterTableEnumSql = (tableName, columnName, constraintName, formerConstraintName, enums, caseFunction) => {
  return [
    `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${formerConstraintName};`,
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
  await knex.raw(
    formatAlterTableEnumSql(
      TABLE_NAME,
      COLUMN_NAME,
      CONSTRAINT_NAME,
      FORMER_CONSTRAINT_NAME,
      ['STARTED', 'COMPLETED'],
      'UPPER',
    ),
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(
    formatAlterTableEnumSql(
      TABLE_NAME,
      COLUMN_NAME,
      FORMER_CONSTRAINT_NAME,
      CONSTRAINT_NAME,
      ['started', 'completed'],
      'LOWER',
    ),
  );
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.text(COLUMN_NAME).defaultTo('started').alter();
    table.integer('organizationLearnerId').nullable().alter();
    table.integer('questId').nullable().alter();
  });
};

export { down, up };
