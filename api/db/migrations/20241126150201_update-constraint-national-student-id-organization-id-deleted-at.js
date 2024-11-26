const TABLE_NAME = 'organization-learners';
const NEW_CONSTRAINT_NAME = 'one_active_sco_organization_learner';
const DELETEDAT_COLUMN = 'deletedAt';
const NATIONAL_STUDENT_ID_COLUMN = 'nationalStudentId';
const ORGANIZATIONID_COLUMN = 'organizationId';

const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, (table) => {
    table.dropUnique(['organizationId', 'nationalStudentId']);
  });

  return knex.raw(
    `CREATE UNIQUE INDEX :name: ON :table: (:nationalStudentId:, :organizationId: ) WHERE :deletedAt: IS NULL;`,
    {
      name: NEW_CONSTRAINT_NAME,
      table: TABLE_NAME,
      nationalStudentId: NATIONAL_STUDENT_ID_COLUMN,
      organizationId: ORGANIZATIONID_COLUMN,
      deletedAt: DELETEDAT_COLUMN,
    },
  );
};

const down = async function (knex) {
  await knex.raw(`DROP INDEX :name:;`, { name: NEW_CONSTRAINT_NAME });

  return knex.schema.table(TABLE_NAME, (table) => {
    table.unique(['organizationId', 'nationalStudentId']);
  });
};

export { down, up };
