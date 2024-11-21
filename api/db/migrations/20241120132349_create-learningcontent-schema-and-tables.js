const SCHEMA_NAME = 'learningcontent';

const up = async function (knex) {
  await knex.raw(`CREATE SCHEMA ??`, [SCHEMA_NAME]);
  await knex.schema.withSchema(SCHEMA_NAME).createTable('frameworks', function (table) {
    table.string('id').primary();
    table.text('name');
  });
  await knex.schema.withSchema(SCHEMA_NAME).createTable('areas', function (table) {
    table.string('id').primary();
    table.string('code');
    table.text('name');
    table.jsonb('title_i18n');
    table.string('color');
    table.string('frameworkId').references('id').inTable(`${SCHEMA_NAME}.frameworks`);
    table.specificType('competenceIds', 'text[]');
  });
  await knex.schema.withSchema(SCHEMA_NAME).createTable('competences', function (table) {
    table.string('id').primary();
    table.jsonb('name_i18n');
    table.jsonb('description_i18n');
    table.string('index');
    table.text('origin');
    table.string('areaId').references('id').inTable(`${SCHEMA_NAME}.areas`);
    table.specificType('skillIds', 'text[]');
    table.specificType('thematicIds', 'text[]');
  });
  await knex.schema.withSchema(SCHEMA_NAME).createTable('thematics', function (table) {
    table.string('id').primary();
    table.jsonb('name_i18n');
    table.integer('index');
    table.string('competenceId').references('id').inTable(`${SCHEMA_NAME}.competences`);
    table.specificType('tubeIds', 'text[]');
  });
  await knex.schema.withSchema(SCHEMA_NAME).createTable('tubes', function (table) {
    table.string('id').primary();
    table.text('name');
    table.text('title');
    table.text('description');
    table.jsonb('practicalTitle_i18n');
    table.jsonb('practicalDescription_i18n');
    table.string('competenceId').references('id').inTable(`${SCHEMA_NAME}.competences`);
    table.string('thematicId').references('id').inTable(`${SCHEMA_NAME}.thematics`);
    table.specificType('skillIds', 'text[]');
    table.boolean('isMobileCompliant');
    table.boolean('isTabletCompliant');
  });
  await knex.schema.withSchema(SCHEMA_NAME).createTable('skills', function (table) {
    table.string('id').primary();
    table.text('name');
    table.string('status');
    table.float('pixValue');
    table.integer('version');
    table.integer('level');
    table.string('hintStatus');
    table.jsonb('hint_i18n');
    table.string('competenceId').references('id').inTable(`${SCHEMA_NAME}.competences`);
    table.string('tubeId').references('id').inTable(`${SCHEMA_NAME}.tubes`);
    table.specificType('tutorialIds', 'text[]');
    table.specificType('learningMoreTutorialIds', 'text[]');
  });
  await knex.schema.withSchema(SCHEMA_NAME).createTable('challenges', function (table) {
    table.string('id').primary();
    table.text('instruction');
    table.text('alternativeInstruction');
    table.text('proposals');
    table.string('type');
    table.text('solution');
    table.text('solutionToDisplay');
    table.boolean('t1Status');
    table.boolean('t2Status');
    table.boolean('t3Status');
    table.string('status');
    table.string('genealogy');
    table.string('accessibility1');
    table.string('accessibility2');
    table.boolean('requireGafamWebsiteAccess');
    table.boolean('isIncompatibleIpadCertif');
    table.string('deafAndHardOfHearing');
    table.boolean('isAwarenessChallenge');
    table.boolean('toRephrase');
    table.integer('alternativeVersion');
    table.boolean('shuffled');
    table.text('illustrationAlt');
    table.text('illustrationUrl');
    table.specificType('attachments', 'text[]');
    table.string('responsive');
    table.float('alpha');
    table.float('delta');
    table.boolean('autoReply');
    table.boolean('focusable');
    table.string('format');
    table.integer('timer');
    table.integer('embedHeight');
    table.text('embedUrl');
    table.text('embedTitle');
    table.specificType('locales', 'text[]');
    table.string('competenceId').references('id').inTable(`${SCHEMA_NAME}.competences`);
    table.string('skillId').references('id').inTable(`${SCHEMA_NAME}.skills`);
  });
  await knex.schema.withSchema(SCHEMA_NAME).createTable('courses', function (table) {
    table.string('id').primary();
    table.text('name');
    table.text('description');
    table.boolean('isActive');
    table.specificType('competences', 'text[]');
    table.specificType('challenges', 'text[]');
  });
  await knex.schema.withSchema(SCHEMA_NAME).createTable('tutorials', function (table) {
    table.string('id').primary();
    table.string('duration');
    table.text('format');
    table.text('title');
    table.text('source');
    table.text('link');
    table.string('locale');
  });
  await knex.schema.withSchema(SCHEMA_NAME).createTable('missions', function (table) {
    table.string('id').primary();
    table.string('status');
    table.jsonb('name_i18n');
    table.jsonb('content');
    table.jsonb('learningObjectives_i18n');
    table.jsonb('validatedObjectives_i18n');
    table.string('introductionMediaType');
    table.text('introductionMediaUrl');
    table.jsonb('introductionMediaAlt_i18n');
    table.text('documentationUrl');
    table.text('cardImageUrl');
    table.string('competenceId').references('id').inTable(`${SCHEMA_NAME}.competences`);
  });
};

const down = function (knex) {
  return knex.schema.dropSchema(SCHEMA_NAME, true);
};

export { down, up };
