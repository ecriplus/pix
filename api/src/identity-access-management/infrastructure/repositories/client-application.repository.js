import { knex } from '../../../../db/knex-database-connection.js';
import { MissingClientApplicationScopesError } from '../../domain/errors.js';
import { ClientApplication } from '../../domain/models/ClientApplication.js';

const TABLE_NAME = 'client_applications';

export const clientApplicationRepository = {
  async findByClientId(clientId) {
    const dto = await knex.select().from(TABLE_NAME).where({ clientId }).first();
    if (!dto) return undefined;
    return toDomain(dto);
  },

  async list() {
    const dtos = await knex.select().from(TABLE_NAME).orderBy('name');
    return dtos.map(toDomain);
  },

  async create({ name, clientId, clientSecret, scopes }) {
    await knex.insert({ name, clientId, clientSecret, scopes }).into(TABLE_NAME);
  },

  async removeByClientId(clientId) {
    const rows = await knex.delete().from(TABLE_NAME).where({ clientId });
    return rows === 1;
  },

  async addScopes(clientId, newScopes) {
    return knex.transaction(async (trx) => {
      const clientApplication = await trx
        .select('scopes')
        .from('client_applications')
        .where('clientId', clientId)
        .forUpdate()
        .first();

      if (!clientApplication) {
        return false;
      }

      const scopes = new Set(clientApplication.scopes);
      newScopes.forEach((scope) => scopes.add(scope));

      await trx('client_applications')
        .update({ scopes: Array.from(scopes), updatedAt: knex.fn.now() })
        .where('clientId', clientId);

      return true;
    });
  },

  async removeScopes(clientId, scopesToRemove) {
    return knex.transaction(async (trx) => {
      const clientApplication = await trx
        .select('scopes')
        .from('client_applications')
        .where('clientId', clientId)
        .forUpdate()
        .first();

      if (!clientApplication) {
        return false;
      }

      const scopes = new Set(clientApplication.scopes);
      scopesToRemove.forEach((scope) => scopes.delete(scope));

      if (!scopes.size) {
        throw new MissingClientApplicationScopesError();
      }

      await trx('client_applications')
        .update({ scopes: Array.from(scopes), updatedAt: knex.fn.now() })
        .where('clientId', clientId);

      return true;
    });
  },

  async setClientSecret(clientId, clientSecret) {
    const rows = await knex(TABLE_NAME).update({ clientSecret, updatedAt: knex.fn.now() }).where({ clientId });
    return rows === 1;
  },
};

function toDomain(dto) {
  return new ClientApplication(dto);
}
