const up = async function (knex) {
  await knex.schema.table('complementary-certification-courses', function (table) {
    table.index('certificationCourseId');
  });
};

const down = async function (knex) {
  await knex.schema.table('complementary-certification-courses', function (table) {
    table.dropIndex('certificationCourseId');
  });
};
export { down, up };
