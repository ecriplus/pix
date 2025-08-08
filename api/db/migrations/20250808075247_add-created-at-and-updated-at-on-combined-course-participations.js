const TABLE_NAME = 'combined_course_participations';

const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, (table) => {
    table.timestamps(false, true, true);
  });
};

const down = function (knex) {
  return knex.schema.table(TABLE_NAME, (table) => {
    table.dropTimestamps(true);
  });
};

export { down, up };
