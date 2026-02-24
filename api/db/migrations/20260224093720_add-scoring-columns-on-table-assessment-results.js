// Make sure you properly test your migration, especially DDL (Data Definition Language)
// ! If the target table is large, and the migration take more than 20 minutes, the deployment will fail !

// You can design and test your migration to avoid this by following this guide
// https://1024pix.atlassian.net/wiki/spaces/EDTDT/pages/3849323922/Cr+er+une+migration

// If your migrations target :
//
// `answers`
// `knowledge-elements`
// `knowledge-element-snapshots`
//
// contact @team-captains, because automatic migrations are not active on `pix-datawarehouse-production`
// this may prevent data replication to succeed the day after your migration is deployed on `pix-api-production`
const TABLE_NAME = 'assessment-results';
const COLUMN_CAPACITY_NAME = 'capacity';
const COLUMN_REACHED_MESH_INDEX_NAME = 'reachedMeshIndex';
const COLUMN_VERSION_ID_NAME = 'versionId';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.float(COLUMN_CAPACITY_NAME).nullable().defaultTo(null).comment('Computed final capacity');
    table
      .smallint(COLUMN_REACHED_MESH_INDEX_NAME)
      .nullable()
      .defaultTo(null)
      .comment(
        'Mesh index reached by the candidate, corresponding to meshes in certification_versions.globalScoringConfiguration',
      );
    table
      .integer(COLUMN_VERSION_ID_NAME)
      .nullable()
      .defaultTo(null)
      .references('certification_versions.id')
      .comment('Fetch related certification version more easily, thus avoiding many joins');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn(COLUMN_CAPACITY_NAME);
    table.dropColumn(COLUMN_REACHED_MESH_INDEX_NAME);
    table.dropColumn(COLUMN_VERSION_ID_NAME);
  });
};

export { down, up };
