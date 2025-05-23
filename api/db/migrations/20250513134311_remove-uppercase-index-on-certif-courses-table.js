const up = async function (knex) {
  await knex.raw('DROP INDEX index_certification_courses_upper_verification_code');
  await knex.raw(
    'CREATE UNIQUE INDEX certification_courses_verification_code_index ON "certification-courses" ("verificationCode")',
  );
};

const down = async function (knex) {
  await knex.raw('DROP INDEX certification_courses_verification_code_index');
  await knex.raw('CREATE UNIQUE INDEX index_certification_courses_upper_verification_code ON ?? (UPPER(??))', [
    'certification-courses',
    'verificationCode',
  ]);
};

export { down, up };
