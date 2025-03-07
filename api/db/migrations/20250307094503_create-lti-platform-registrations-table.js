const TABLE_NAME = 'lti_platform_registrations';

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.string('clientId').primary().comment('ClientId attribué par la plateforme');
    table.string('platformOrigin').notNullable().comment("Url d'origine de la plateforme");
    table.string('status').notNullable().comment('Statut de la plateforme : PENDING, ACTIVE');
    table.jsonb('toolConfig').notNullable().comment("Configuration de Pix en tant qu'outils faite par la plateforme");
    table
      .string('encryptedPrivateKey')
      .notNullable()
      .comment('Clé privée, au format JWK, chiffrée pour la communication avec la plateforme');
    table.jsonb('publicKey').notNullable().comment('Clé publique au format JWK');
    table
      .string('platformOpenIdConfigUrl')
      .notNullable()
      .comment("URL permettant d'obtenir la configuration OpenId de la plateforme");
    table.timestamps(false, true, true);

    table.comment('Enregistrement de plateformes LTI - potentiellement plusieurs enregistrements par plateforme');
  });
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
